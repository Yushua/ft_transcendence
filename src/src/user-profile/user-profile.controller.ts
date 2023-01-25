import { Controller, Get, Query } from '@nestjs/common';
import { getTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UserProfileService } from './user-profile.service';
import { UserProfile } from './user.entity';

@Controller('user-profile')
export class UserProfileController {
    constructor(private taskServices: UserProfileService) {}

    @Get('/user')
    getAllTasks(@Query() filterDto: getTasksFilterDto): Promise<UserProfile[]> {
        return this.taskServices.findAllUsers(filterDto);
    }
}
