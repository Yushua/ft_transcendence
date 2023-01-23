import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { stat } from 'fs';
import { Repository } from 'typeorm';
import { UpdateStatusDto } from './dto/updata-status.dto';
import { userProfileCredentialsDto } from './dto/user-profile-credentials.dto';
import { UserProfile } from './user-profile.entity';
import { UserStatus } from './user-status.module';

@Injectable()
export class UserProfileService {
    constructor(
        @InjectRepository(UserProfile)
        private readonly userProfileEntity: Repository<UserProfile>,
    ) {}

    async findUserById(id: string): Promise<UserProfile> {
        const _user = this.userProfileEntity.findOneBy({id});
        if (!_user) {
            throw new NotFoundException(`User with id "${id}" not found`);
        }
        return _user;
    }

    async injectUser(userProfileCredentialsDto: userProfileCredentialsDto): Promise<UserProfile> {
        const { username } = userProfileCredentialsDto;

        const _user = this.userProfileEntity.create({
            username,
            status: UserStatus.CREATION,})

        await this.userProfileEntity.save(_user);
        return _user;
        }

        async findUserProfileById(id: string): Promise<UserProfile> {
            const _user = this.findUserById(id);

            return _user;
        }

        async getAll(): Promise<UserProfile[]> {
            const query = this.userProfileEntity.createQueryBuilder('task');
            const _user = await query.getMany();
            return _user;
        }
        async updateStatus(id: string, status: UserStatus): Promise<UserProfile> {
            const _user = await this.findUserById(id);
            _user.status = status;

            await this.userProfileEntity.save(_user);
            return _user;
        }
}
