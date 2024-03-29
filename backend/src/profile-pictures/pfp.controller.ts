import { Controller, FileTypeValidator, Get, HttpException, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Post, Delete, Request, Response, StreamableFile, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'
import { lookup, extension } from 'mime-types';
import { InjectRepository } from '@nestjs/typeorm';
import { PFPEntity } from './pfp.entity';
import { UserProfile } from 'src/user-profile/user.entity';
import { Repository } from 'typeorm';
import { validateBufferMIMEType } from "validate-image-type";
import { AuthGuard } from '@nestjs/passport';
import { AuthGuardEncryption } from 'src/auth/auth.guard';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller("pfp")
export class PFPController {
	
	constructor(
		@InjectRepository(PFPEntity)
			private readonly pfpRepo: Repository<PFPEntity>,
		@InjectRepository(UserProfile)
			private readonly userRepo: Repository<UserProfile>,
	) {}
	
	//#region DEBUG
	
	@Delete() deleteAll() { return this.pfpRepo.delete({}) }
	
	//#endregion
	
	@Get("user/:id")
	async GetUserPFPURL(@Param("id") id: string) {
		return this.userRepo.findOneBy({id})
			.then(user => user.profilePicture)
	}
	
	@Get(":path")
	async GetPFP(
		@Param("path") path: string,
		@Response({ passthrough: true }) response,
	) {
		if (path === "")
			throw new HttpException("", HttpStatus.BAD_REQUEST)

		if (path === "default_pfp.jpg") {
			const actualPath: string = `./src/profile-pictures/default_pfp.jpg`
			
			response.set({'Content-Type': lookup(actualPath)})
			
			const file = createReadStream(join(process.cwd(), actualPath))
			
			return new StreamableFile(file)
		}
		
		const pictureID = path.substring(0, path.lastIndexOf('.'))
		const pfp = await this.pfpRepo.findOneBy({ID: pictureID})
		
		response.set({'Content-Type': lookup(path)})
		return new StreamableFile(Buffer.from(pfp.PictureData, "base64"))
	}
	
	@Post()
	@UseGuards(AuthGuard('jwt'), AuthGuardEncryption)
	@UseInterceptors(FileInterceptor('file'))
	async PostPFP(
		@Request() request: Request,
		@Response({ passthrough: true }) response,
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: +process.env.MAX_PROFILE_PICTURE_SIZE_IN_BYTES }),
				],
			}),
		) file: Express.Multer.File
	): Promise<string> {
		
		/* Validate image content */
		const result = await validateBufferMIMEType(file.buffer, {
			allowMimeTypes: ['image/jpeg', 'image/gif', 'image/png']
		})
		if (!result.ok)
			throw new HttpException(
				"Only images of type .png, .jpg, .jpeg and .gif are allowed!",
				HttpStatus.BAD_REQUEST)
		
		/* Save image to database */
		const pfpID = (await this.pfpRepo.save(this.pfpRepo.create({
			PictureData: file.buffer.toString('base64')
		}))).ID
		const pfpURL = `${pfpID}.${extension(file.mimetype)}`
		
		/* Change user PFP */
		const user: UserProfile = request["user"]
		const pfpOldURL = user.profilePicture
		user.profilePicture = pfpURL
		await this.userRepo.save(user)
		
		/* Delete old PFP if no User is using it */
		if (pfpOldURL !== "default_pfp.jpg")
			this.userRepo.count({where: {profilePicture: pfpOldURL}})
				.catch(() => {})
				.then(res => {
					if (!res)
						this.pfpRepo.delete({ID: pfpOldURL.substring(0, pfpOldURL.lastIndexOf('.'))}).catch(() => {})
				})
		
		return pfpURL
	}
}
