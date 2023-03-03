import { Controller, Get, Request, Response, StreamableFile } from '@nestjs/common';
import { lookup } from 'mime-types';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller()
export class AppController {
	
	constructor () {}
	
	@Get()
	GetIndexPage(
		@Request() request: Request,
		@Response({ passthrough: true }) response) {
			
			const actualPath: string = `../frontend/build/index.html`
			
			response.set({'Content-Type': lookup(actualPath)})
			
			const file = createReadStream(join(process.cwd(), actualPath))
			
			return new StreamableFile(file)
		}
	
	@Get("app/*")
	GetRedirectToWebApp(
		@Request() request: Request,
		@Response({ passthrough: true }) response) {
			
			const actualPath: string = `../frontend/build/${request.url.substring(4)}`
			
			response.set({'Content-Type': lookup(actualPath)})
			
			const file = createReadStream(join(process.cwd(), actualPath))
			
			return new StreamableFile(file)
		}
}
