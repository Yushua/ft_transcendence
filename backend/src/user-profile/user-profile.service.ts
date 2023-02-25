import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddFriendListDto } from './dto/create-user.dto copy';
import { getTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UserStatus } from './user-profile-status.model';
import { UserProfile } from './user.entity';
import { StatProfile } from './user.stat.entity';

@Injectable()
export class UserProfileService {
    constructor(
        @InjectRepository(UserProfile)
        private readonly userEntity: Repository<UserProfile>,
        @InjectRepository(StatProfile)
        private readonly statEntity: Repository<StatProfile>,
      ) {}

      async addFriendToID(userID: string, friendID: string):Promise<void>{
          const user = await this.findUserBy(userID);
          if (!user){
            throw new NotFoundException(`Task with ID "${userID}" not found`);
          }
          user.friendList.forEach( (item) => {
            if(item === friendID){
              throw new NotFoundException(`Friend "${friendID}" already added`);
              return ;
            }
          });
          user.friendList.push(friendID);
          await this.userEntity.save(user);
      }
      async removeFriendFromID(userID: string, friendID: string):Promise<void>{
        const user = await this.findUserBy(userID);
        user.friendList.forEach( (item, index) => {
          if(item === friendID) user.friendList.splice(index,1);
        });
        await this.userEntity.save(user);
      }

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

      async findUserBy(id: string): Promise<UserProfile> {
        const found = await this.userEntity.findOneBy({id});
        if (!found){
          throw new NotFoundException(`Task with ID "${id}" not found`);
        }
        return found;
      }
      
      async findUserName(username: string): Promise<UserProfile> {
        const found = await this.userEntity.findOneBy({username});
        if (!found){
          throw new NotFoundException(`Task with username "${username}" not found`);
        }
        return found;
      }

      returnNameById(id: string): Promise<UserProfile> {
        const found = this.userEntity.findOneBy({id});
        if (!found){
          throw new NotFoundException(`Task with ID "${id}" not found`);
        }
        return found;
      }

      async changeStatus(status: UserStatus, id: string): Promise<UserProfile> {
        const found = await this.findUserBy(id);
        found.status = status;
        await this.userEntity.save(found);
        return found;
      }

      async changeUsername(username: string, id: string): Promise<UserProfile> {
        const found = await this.findUserBy(id);
        found.username = username;
        try {
          await this.userEntity.save(found);
        } catch (error) {
          console.log(`error "${error.code}`);
            if (error.code === '23505'){
                throw new ConflictException(`account name "${username} was already in use1`);
            }
            else {
                throw new InternalServerErrorException(`account name "${error.code} was already in use, but the error is different`);
            }
        }
        return found;
      }

      async addFriend(id:string, idfriend: string):Promise<UserProfile> {
        const found = await this.userEntity.findOneBy({id});
        //get all the users into one list
        console.log(idfriend);
        found.friendList.push(idfriend);
        await this.userEntity.save(found);
        console.log(found);
        return found;
      }

      async getAllUsersIntoList():Promise<string[]> {
        console.log("getallusersnames")
        // var newList: string[];
        // return this.userEntity.query("SELECT username FROM user_profile;")
        return (await this.userEntity.query("SELECT username FROM user_profile;")).map(user => user.username)
        // const users = await query.getMany();

        // return newList;
      }
      async getUsersListFriendById(id:string):Promise<void> {
        
        var newList: string[] = await this.getAllUsersIntoList()
        console.log(newList);
      }
}
