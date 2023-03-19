import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserTwoFactor } from './userTwoFactor.entity';

@Injectable()
class UserTwoFactorEntityRepository {
  constructor(
    @InjectRepository(UserTwoFactor)
    private readonly UserTwoFactorEntityRepos: Repository<UserTwoFactor>,
  ) {}

  async createUser(userID: string, twoFactor: boolean, secretCode:string) {
    var user:UserTwoFactor = await this.UserTwoFactorEntityRepos.findOneBy({ id:userID })
    if (user){
        user.secretCode = secretCode
        await this.UserTwoFactorEntityRepos.save(user)
    }
    else {
        user = this.UserTwoFactorEntityRepos.create({
            id:userID, twoFactor, secretCode
            });
        await this.UserTwoFactorEntityRepos.save(user)
    }
  }
  async returnUserWithId(id: string):Promise<UserTwoFactor>{
    return await this.UserTwoFactorEntityRepos.findOneBy({ id })
  }
}
export { UserTwoFactorEntityRepository };