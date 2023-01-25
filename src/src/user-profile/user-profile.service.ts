import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UserProfile } from './user.entity';

@Injectable()
export class UserProfileService {
    constructor(
        @InjectRepository(UserProfile)
        private readonly userEntity: Repository<UserProfile>,
      ) {}

      async findAllUsers(filterDto: getTasksFilterDto): Promise<UserProfile[]> {
        const { status, search } = filterDto;
        const query = this.userEntity.createQueryBuilder('userProfile');
     
        if (status) {
          query.andWhere('task.status = :status', { status });
        }
     
        if (search) {
          query.andWhere(
            'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
            { search: `%${search}%` },
          );
        }
     
        const users = await query.getMany();
        return users;
      } 
}
