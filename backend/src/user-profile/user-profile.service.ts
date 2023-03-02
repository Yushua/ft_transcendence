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
      
      async getUserIdWithName(username:string):Promise<string> {
        const found = await this.userEntity.findOneBy({username});
        const idFriend = found.id;
        return idFriend
      }
      
      /**
       * add friends based on the id, add id friend
       * @returns 
       */
      async addFriend(id:string, idfriend: string):Promise<UserProfile> {
        const found = await this.userEntity.findOneBy({id});
        //get all the users into one list
        idfriend = await this.getUserIdWithName(idfriend)
        console.log("idfriend ==",  idfriend);
        found.friendList.push(idfriend);
        await this.userEntity.save(found);
        return found;
      }

      /**
       * remove friends based on the id, remove id friend
       * @returns 
       */
      async removeFriend(id:string, idfriend: string):Promise<UserProfile> {
        const found = await this.userEntity.findOneBy({id});
        //get all the users into one list
        console.log("remove ", idfriend);
        found.friendList.splice(found.friendList.indexOf(idfriend), 1);
        if (found.friendList == null)
          found.friendList = [];
        await this.userEntity.save(found);

        console.log("removed ", idfriend);
        return found;
      }

      async getAllUsersIntoList():Promise<string[]> {
        console.log("getalluserId's")
        return (await this.userEntity.query("SELECT id FROM user_profile;")).map(user => user.id)

      }

      /**
       * 
       * @param id 
       * @returns return a list of all the users, resuts an array of all id's
       */
      async getAllUsersByFriendList(id:string):Promise<string[]> {
        var newList: string[] = await this.getAllUsersIntoList()
        return(newList);
      }

      /**
       * 
       * @param id 
       * @returns return a list of all the users it can add, returns an array of id's
       */
      async getAllUsersAddList(id:string):Promise<string[]> {
        var fullList: string[] = await this.getAllUsersIntoList()
        const found = await this.userEntity.findOneBy({id});
        return fullList.filter(userID => found.id !== userID && !found.friendList.includes(userID))
      }

      /**
       * 
       * @param id 
       * @returns get the users friendslist returns an array of the suers friendlist
       */
      async getUsersListFriendById(id:string):Promise<string[]> {
        const found = await this.userEntity.findOneBy({id});
        return(found.friendList);
      }
}
