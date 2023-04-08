import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import OurSession from 'src/session/OurSession';
import { Repository } from 'typeorm';
import { getTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UserProfile } from './user.entity';
import { UserAchievement } from './userAchievement.entity';
import { AddAchievement } from './dto/addAchievement.dto';

@Injectable()
export class UserProfileService {
    constructor(
        @InjectRepository(UserProfile)
        private readonly userEntity: Repository<UserProfile>,
        @InjectRepository(UserAchievement)
        private readonly achievEntity: Repository<UserAchievement>,
      ) {}

      async addFriendToID(userID: string, friendID: string):Promise<void>{
          const user = await this.findUserBy(userID);
          if (!user){
            throw new NotFoundException(`Task with ID "${userID}" not found`);
          }
          user.friendList.forEach( (item) => {
            if(item === friendID){
              throw new NotFoundException(`Friend "${friendID}" already added`);
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
        const { search } = filterDto;
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

      async changeUsername(username: string, id: string): Promise<UserProfile> {
        const found = await this.findUserBy(id);
        found.username = username;
        try {
          await this.userEntity.save(found);
        }
        catch (error) {
            if (error.code === '23505'){
                throw new ConflictException(`account name "${username} was already in use`);
            }
            else {
                throw new InternalServerErrorException(`account name "${error.code} was already in use, but the error is different`);
            }
        }
        return found;
      }

      //turn the username of the friend into an id, and then add it to the currect user
      async addFriend(userid:string, otherId: string) {
        const found = await this.userEntity.findOneBy({id: userid});
        const foundFriend = await this.userEntity.findOneBy({id: otherId});
        found.friendList.push(foundFriend.id);
        await this.userEntity.save(found);
      }

        /** */
      async getUserIdWithName(username:string):Promise<string> {
        const found = await this.userEntity.findOneBy({username});
        const idFriend = found.id;
        return idFriend
      }

      /**
       * remove friends based on the id
       * @returns 
       */
      async removeFriend(id:string, idfriend: string):Promise<UserProfile> {
        const found = await this.userEntity.findOneBy({id});
        //get all the users into one list
        found.friendList.splice(found.friendList.indexOf(idfriend), 1);
        if (found.friendList == null)
          found.friendList = [];
        await this.userEntity.save(found);
        return found;
      }

        /**
       * check if to follow or unfollow
       * @returns 
       */
           async checkFriend(id:string, idfriend: string):Promise<Number> {
            if (id == idfriend)
              return 3
            return 3
          }
      async getAllUsersIntoList():Promise<string[]> {
        return (await this.userEntity.query("SELECT id FROM user_profile;")).map(user => user.id)
      }

      /**
       * 
       * @param id 
       * @returns return users friendlist with ID's
       */
      async UsersFriendlistID(id:string):Promise<string[]> {
        const found = await this.userEntity.findOneBy({id});
        return(found.friendList);
      }

      /**
       * 
       * @param id 
       * @returns return users friendlist with usernames
       */
        async UsersFriendlistUsername(id:string):Promise<string[]> {
          const found = await this.userEntity.findOneBy({id});
          var username:string;
          var fullList:string[] = found.friendList
          for(var i = 0, len = fullList.length; i < len; ++i){
            var id:string = fullList[i]
            const found = await this.userEntity.findOneBy({id})
            username = found.username
            fullList[i] = username
          }
          return(fullList);
        }
      /**
       * 
       * @param id 
       * @returns give username, return ID
       */
      async ReturnWithUsername(username:string):Promise<UserProfile>  {
        const found = await this.userEntity.findOneBy({username});
        return found;
      }

      /**
       * 
       * @param id 
       * @returns give id, return username
       */
      async ReturnUsername(id:string):Promise<string> {
        const found = await this.userEntity.findOneBy({id});
        var tmp:string = found.username;
        return tmp;
      }

      /**
       * 
       * @param id 
       * @returns return a list of all the users it can add, returns an array of id's
       */
      async getAllUsersAddList(id:string):Promise<string[]> {
        var fullList: string[] = await this.getAllUsersIntoList()
        const found = await this.userEntity.findOneBy({id});
        fullList = fullList.filter(user => !found.id.includes(user))
        return fullList.filter(user => !found.friendList.includes(user))
      }

      /**
       * 
       * @param id 
       * @returns return a list of all the users it can add, returns an array of id's
       */
        async getAllUsersAddListUsername(id:string):Promise<string[]> {
          var fullList: string[] = await this.getAllUsersAddList(id)
          var username:string;
          for(var i = 0, len = fullList.length; i < len; ++i){
            var id:string = fullList[i]
            const found = await this.userEntity.findOneBy({id})
            username = found.username
            fullList[i] = username
          }
          return fullList;
        }

      /**
       * 
       * @param id 
       * @returns get the users friendslist returns an array of the suers friendlist
       */
      async getUsersFriendlist(id:string):Promise<string[]> {
        const found = await this.userEntity.findOneBy({id});
        return(found.friendList);
      }

      /**
       * returns based on [["pfp", "username"]]
       */
      async SearchList():Promise<string[][]>{
        const users:UserProfile[] = await this.userEntity.find()
        return users.map(user => [user.profilePicture, user.username, OurSession.GetUserState(user.id), user.id]);
      }

      /**
       * returns based on [["pfp", "username", "status"], ["pfp", "username", "status"], ["pfp", "username", "status"]]
       */
      async GetFriendList(id:string):Promise<string[][]> {
        var userprofile:UserProfile = await this.userEntity.findOneBy({id});
        if (userprofile.friendList == undefined){
          return []
        }
        const users: UserProfile[] = await this.userEntity.createQueryBuilder('user').where('user.id IN (:...id)', { id: userprofile.friendList }).getMany();
        var list:string[][] = users.map(user => [user.profilePicture, user.username, OurSession.GetUserState(user.id), user.id]);
        return list
      }

      /**
       * returns based on [["picture", "name", "status"]]
       */
      async postAchievementList(id:string, AddAchievement:AddAchievement) {
        const {nameAchievement, pictureLink, message} = AddAchievement
        var userprofile = await this.userEntity.findOneBy({id});//player1
        const achievement = await this.achievEntity.create({
          nameAchievement: nameAchievement,
          pictureLink: pictureLink,
          message: message,
          userProfile: userprofile
        });
        await this.achievEntity.save(achievement);
      }

      async GetAllAchievements():Promise<UserAchievement[]> {
        const achieve:UserAchievement[] = await this.achievEntity.find()
        return achieve
      }

      async GetUserAchievment(id:string):Promise<UserAchievement[]> {
        const userprofile:UserProfile = await this.userEntity.findOneBy({id});
        return userprofile.UserAchievement
      }
}
