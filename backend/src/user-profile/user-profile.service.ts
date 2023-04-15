import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import OurSession from 'src/session/OurSession';
import { Repository, UpdateDateColumn } from 'typeorm';
import { getTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UserProfile } from './user.entity';
import { UserAchievement } from './userAchievement.entity';
import { AddAchievement } from './dto/addAchievement.dto';
import { AddMessageDTO, AddMessageDTOOtherUser, AddMessageDTOUser } from './dto/addMessage.dto';
import { MessageList } from './MessageList.entity';

class MyEntity {
  @UpdateDateColumn({ type: "bigint" })
  createdAt: Date;
}

@Injectable()
export class UserProfileService {
    constructor(
        @InjectRepository(UserProfile)
        private readonly userEntity: Repository<UserProfile>,
        @InjectRepository(UserAchievement)
        private readonly achievEntity: Repository<UserAchievement>,
        @InjectRepository(MessageList)
        private readonly messageList: Repository<MessageList>,
      ) {
        UserProfileService._instance = this
      }

      private static _instance: UserProfileService | null = null
      static GetInstance(): UserProfileService | null {
        return this._instance
      }
      
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
        const found:UserProfile = await this.userEntity.findOneBy({id});
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
        const found = await this.findUserBy(id)
        try {
          found.username = username;
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
        //add the other suer to the user, fomring the friendlist
        const found = await this.userEntity.findOneBy({id: userid});
        found.friendList.push(otherId);
        await this.userEntity.save(found);
        //tells the other user, this person has added them
        const found1 = await this.userEntity.findOneBy({id: otherId});
        found1.otherfriendList.push(userid);
        await this.userEntity.save(found1);
        if (found1.friendList.includes(found.id) && found.friendList.includes(found1.id)){
          //post message
          let addMessage:AddMessageDTO = {
            status: "Achievement", 
            message: `${found.username} and ${found1.username} both became friends`,
            userID: found.id
          }
          await this.SetupMessageToFriends(addMessage, found.id)
          //sends to this usersfriends that they became friends
          addMessage = {
            status: "Achievement", 
            message: `${found.username} and ${found1.username} both became friends`,
            userID: found.id
          }
          await this.SetupMessageToFriends(addMessage, found1.id)
          //will already go to the other person because they're both friends
        }
      }

      /**
       * remove friends based on the id
       * @returns 
       */
      async removeFriend(id:string, idfriend: string):Promise<UserProfile> {
        //remove friend from user
        const found = await this.userEntity.findOneBy({id});
        found.friendList.splice(found.friendList.indexOf(idfriend), 1);
        if (found.friendList == null)
          found.friendList = [];
        await this.userEntity.save(found);
        //IF CHECKFRIEND INCLUDED the friend, then remove it,
        if (found.CheckFrienddList.includes(idfriend)) {
          found.CheckFrienddList.splice(found.CheckFrienddList.indexOf(idfriend), 1)
        }
        //tell the other user that you have removed them
        const found1 = await this.userEntity.findOneBy({id:idfriend});
        found1.otherfriendList.splice(found1.otherfriendList.indexOf(id), 1);
        if (found1.otherfriendList == null)
          found1.otherfriendList = [];
        await this.userEntity.save(found1);
        return found;
      }

        /** */
      async getUserIdWithName(username:string):Promise<string> {
        const found = await this.userEntity.findOneBy({username});
        const idFriend = found.id;
        return idFriend
      }


        /**
       * check if to follow or unfollow
       * @returns 
       */
      async checkFriend(id:string, idfriend: string):Promise<Number> {
        const user = await this.userEntity.findOneBy({id});
        const hasFriend = user.friendList.some(friendlist => friendlist.includes(idfriend));
  
        return hasFriend ? 1 : 2;
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
      async SearchList(friendName:string):Promise<string[][]>{
        const users = await this.userEntity.find();
        const filteredUsers = users.filter(user => user.username.toLowerCase().includes(friendName.toLowerCase()));
        return filteredUsers.map(user => [user.profilePicture, user.username, OurSession.GetUserState(user.id), user.id]);
      }

      /**
       * returns based on [["pfp", "username", "status"], ["pfp", "username", "status"], ["pfp", "username", "status"]]
       */
      async GetFriendList(id:string):Promise<string[][]> {
        var userprofile:UserProfile = await this.userEntity.findOneBy({id});
        if (userprofile.friendList.length === 0){
          return []
        }
        const users: UserProfile[] = await this.userEntity.createQueryBuilder('user').where('user.id IN (:...id)', { id: userprofile.friendList }).getMany();
        var list:string[][] = users.map(user => [user.profilePicture, user.username, OurSession.GetUserState(user.id), user.id]);
        return list
      }

      /**
       */
      async postAchievementList(id:string, AddAchievement:AddAchievement) {
        console.log("adding")
        const {nameAchievement, pictureLink, message} = AddAchievement
        var userprofile = await this.userEntity.findOneBy({id});
        var achieveStore:UserAchievement[] = userprofile.UserAchievement
        var achieve:UserAchievement = achieveStore.find(
          (achievement) => achievement.nameAchievement === nameAchievement,
        );
        // var date = new Date()
        // var tmp:string = date.toISOString().slice(0, 10)
        if (achieve == undefined){
          throw new HttpException(`achievement trying to add does NOT exist check the name`, HttpStatus.BAD_REQUEST);
        }
        achieve.pictureLink = pictureLink
        achieve.message = message
        achieve.status = true
        achieve.timeStamp = Math.floor(Date.now() / 1000) /* seconds since epoch */
        console.log("asving")
        await this.achievEntity.save(achieve);

        // userprofile = await this.userEntity.findOneBy({id});
        // achieveStore = userprofile.UserAchievement
        // achieve = achieveStore.find(
        //   (achievement) => achievement.nameAchievement === nameAchievement,
        // );
        let addMessage:AddMessageDTO = {
          status: "Achievement", 
          message: `${userprofile.username} has achieved ${nameAchievement}`,
          userID: id
        }
        await this.SetupMessageToFriends(addMessage, id)
        
      }

      /**
       */
      async AddAchievementList(id:string, AddAchievement:AddAchievement) {
        const {nameAchievement, pictureLink, message} = AddAchievement
        var userprofile = await this.userEntity.findOneBy({id});//player1
        const achievement = this.achievEntity.create({
          nameAchievement: nameAchievement,
          pictureLink: pictureLink,
          message: message,
          status: false,
          timeStamp:  Math.floor(Date.now() / 1000), /* seconds since epoch */
          userProfile: userprofile
        });
        await this.achievEntity.save(achievement);
      }

      async getWinList():Promise<string[][]>{
        const users = await this.userEntity.find({order: { wins: 'DESC' } })
        var list:string[][] = users.map(user => [user.username, user.wins.toString(), user.losses.toString()]);
        return list
      }

      async getExpList():Promise<string[][]>{
        const users = await this.userEntity.find({order: { experience: 'DESC' } })
        var list:string[][] = users.map(user => [user.username, user.experience.toString()]);
        return list
      }

      async getPongWinsList():Promise<string[][]>{
        const users = await this.userEntity.find({order: { pong_wins: 'DESC' } })
        var list:string[][] = users.map(user => [user.username, user.pong_wins.toString(), user.pong_losses.toString()]);
        return list
      }

      /* UserAchievement */

      /**
       * when done, so when status == true
       * @returns 
       */
      async GetUserAchievementDone(id:string):Promise<UserAchievement[]> {
        const userprofile:UserProfile = await this.userEntity.findOneBy({id});
        var achieveStore:UserAchievement[] = userprofile.UserAchievement.filter(a => a.status === true);
        achieveStore.sort((a, b) => (a.timeStamp - b.timeStamp));
        return achieveStore
      }

      /**
       * when done, so when status == false
       * @returns 
       */
      async GetUserAchievementNotDone(id:string):Promise<UserAchievement[]> {
        const userprofile:UserProfile = await this.userEntity.findOneBy({id});
        var achieveStore:UserAchievement[] = userprofile.UserAchievement.filter(a => a.status === false);
        achieveStore.sort((a, b) => (a.timeStamp - b.timeStamp));
        return achieveStore
      }

      async GetUserAchievementFull(id:string):Promise<UserAchievement[]> {
        const userprofile:UserProfile = await this.userEntity.findOneBy({id});
        return userprofile.UserAchievement;
      }

      /*
        MessageList
      */

      async SetupMessageToFriends(addMessageUser: AddMessageDTOUser, addMessageOtherUser: AddMessageDTOOtherUser, id:string){
        //add this message to you
        var userprofile = await this.userEntity.findOneBy({id});//player1
        await this.AddMessageToUser(addMessageUser, id, userprofile)
        //add this message to everyone that has you as a friend, but only add if he has friends
        if (userprofile.otherfriendList.length > 0){
          await this.AddMessageToOthers(addMessageOtherUser, userprofile.otherfriendList, id)
        }
      }

      async AddMessageToUser(addMessage: AddMessageDTO, id:string, userprofile:UserProfile){
        //set a limit on how many will be created, but only after testing
        const {status, message, userID} = addMessage
        if (status == "Achievement" && userprofile.YourAchievements == true){
          const user = await this.messageList.findOne({ where: { status, message, userID } });
          //if it does not exist, then don't create it
          if (!user) {
            var userprofile = await this.userEntity.findOneBy({id});//player1
            const StoredMessageList = this.messageList.create({
              status: status,
              message: message,
              timeStamp:  Math.floor(Date.now() / 1000),
              userID: userID,
              userProfile: userprofile
            });
            await this.messageList.save(StoredMessageList);
          }
        }
      }

      async AddMessageToOthers(addMessage: AddMessageDTO, otherfriendList:string[], idMain:string){

        for (let id of otherfriendList) {
            //loop through the lsit and give each of them this message
            var userprofile = await this.userEntity.findOneBy({id});//player1
            //if this user has him in his list, then add. if not, then this suer does not want to recieve messages
            if (!userprofile.CheckFrienddList.includes(idMain)) {
              await this.AddMessageToUser(addMessage, id, userprofile)
            }
        }
        //find out who has this user added as a friend, and then send them this message
      }

      async RemoveMessageListWithID(userID:string){
        await this.messageList.delete(userID);
      }

      async addToCheckList(id:string, addID:string){
        //if addID is not in id friendlist, then they can not add
        var userprofile = await this.userEntity.findOneBy({id});//player1
        if (userprofile.friendList.includes(addID)) {
          userprofile.CheckFrienddList.push(addID)
          await this.userEntity.save(userprofile)
        }
      }

      async removeToCheckList(id:string, addID:string){
        //if addID is not in id friendlist, then they can not add
        var userprofile = await this.userEntity.findOneBy({id});//player1
        userprofile.CheckFrienddList.splice(userprofile.CheckFrienddList.indexOf(addID), 1);
        await this.userEntity.save(userprofile)
      }
}
