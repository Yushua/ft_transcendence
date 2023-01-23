import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UpdateStatusDto } from './dto/updata-status.dto';
import { userProfileCredentialsDto } from './dto/user-profile-credentials.dto';
import { UserProfile } from './user-profile.entity';
import { UserProfileService } from './user-profile.service';
import { UserStatus } from './user-status.module';

@Controller('user-profile')
export class UserProfileController {
    constructor(private userProfileService: UserProfileService) {}

    @Post('user')
    postUserProfile(
        @Body() userProfileCredentialsDto: userProfileCredentialsDto ): Promise<UserProfile> {
        return this.userProfileService.injectUser(userProfileCredentialsDto);
    }

    @Post('/offlineGive/:id') 
    getOfflineGive( @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto): Promise<UserProfile> {
        const {status} = updateStatusDto;
            return this.userProfileService.updateStatus(id, status);
        }

    @Post('/offline/:id') 
    getOffline( @Param('id') id: string): Promise<UserProfile> {
            return this.userProfileService.updateStatus(id, UserStatus.OFFLINE);
        }

    @Post('/online/:id') 
    getOnline( @Param('id') id: string): Promise<UserProfile> {
            return this.userProfileService.updateStatus(id, UserStatus.ONLINE);
        }
    
    @Get('/:id')
    getUserProfileById( @Param('id') id: string,
    ): Promise<UserProfile> {
        return this.userProfileService.findUserProfileById(id);
    }

    @Get()
    getAllUseProfile():Promise<UserProfile[]> {
        return this.userProfileService.getAll();
    }

    //get all offline and online
    // @Get('/online')
    // getAllUseProfileOnline():Promise<UserProfile[]> {
    //     return this.userProfileService.getAllOnline();
    // }
    // @Get('/offline')
    // getAllUseProfileOffline():Promise<UserProfile[]> {
    //     return this.userProfileService.getAllOffline();
    // }
}
