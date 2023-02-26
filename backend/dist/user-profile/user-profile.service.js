"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfileService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const user_stat_entity_1 = require("./user.stat.entity");
let UserProfileService = class UserProfileService {
    constructor(userEntity, statEntity) {
        this.userEntity = userEntity;
        this.statEntity = statEntity;
    }
    async addFriendToID(userID, friendID) {
        const user = await this.findUserBy(userID);
        if (!user) {
            throw new common_1.NotFoundException(`Task with ID "${userID}" not found`);
        }
        user.friendList.forEach((item) => {
            if (item === friendID) {
                throw new common_1.NotFoundException(`Friend "${friendID}" already added`);
                return;
            }
        });
        user.friendList.push(friendID);
        await this.userEntity.save(user);
    }
    async removeFriendFromID(userID, friendID) {
        const user = await this.findUserBy(userID);
        user.friendList.forEach((item, index) => {
            if (item === friendID)
                user.friendList.splice(index, 1);
        });
        await this.userEntity.save(user);
    }
    async findAllUsers(filterDto) {
        const { status, search } = filterDto;
        const query = this.userEntity.createQueryBuilder('userProfile');
        if (status) {
            query.andWhere('task.status = :status', { status });
        }
        if (search) {
            query.andWhere('LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)', { search: `%${search}%` });
        }
        const users = await query.getMany();
        return users;
    }
    async findUserBy(id) {
        const found = await this.userEntity.findOneBy({ id });
        if (!found) {
            throw new common_1.NotFoundException(`Task with ID "${id}" not found`);
        }
        return found;
    }
    async findUserName(username) {
        const found = await this.userEntity.findOneBy({ username });
        if (!found) {
            throw new common_1.NotFoundException(`Task with username "${username}" not found`);
        }
        return found;
    }
    returnNameById(id) {
        const found = this.userEntity.findOneBy({ id });
        if (!found) {
            throw new common_1.NotFoundException(`Task with ID "${id}" not found`);
        }
        return found;
    }
    async changeStatus(status, id) {
        const found = await this.findUserBy(id);
        found.status = status;
        await this.userEntity.save(found);
        return found;
    }
    async changeUsername(username, id) {
        const found = await this.findUserBy(id);
        found.username = username;
        try {
            await this.userEntity.save(found);
        }
        catch (error) {
            console.log(`error "${error.code}`);
            if (error.code === '23505') {
                throw new common_1.ConflictException(`account name "${username} was already in use1`);
            }
            else {
                throw new common_1.InternalServerErrorException(`account name "${error.code} was already in use, but the error is different`);
            }
        }
        return found;
    }
    async addFriend(id, idfriend) {
        const found = await this.userEntity.findOneBy({ id });
        console.log(idfriend);
        found.friendList.push(idfriend);
        await this.userEntity.save(found);
        console.log(found);
        return found;
    }
    async removeFriend(id, idfriend) {
        const found = await this.userEntity.findOneBy({ id });
        found.friendList.splice(found.friendList.indexOf(idfriend), 1);
        if (found.friendList == null)
            found.friendList = [];
        await this.userEntity.save(found);
        console.log("removed ", idfriend);
        console.log(found.friendList);
        return found;
    }
    async getAllUsersIntoList() {
        console.log("getallusersnames");
        return (await this.userEntity.query("SELECT username FROM user_profile;")).map(user => user.username);
    }
    async getAllUsersByFriendList(id) {
        var newList = await this.getAllUsersIntoList();
        const found = await this.userEntity.findOneBy({ id });
        return (newList);
    }
    async getUsersListFriendById(id) {
        const found = await this.userEntity.findOneBy({ id });
        return (found.friendList);
    }
};
UserProfileService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserProfile)),
    __param(1, (0, typeorm_1.InjectRepository)(user_stat_entity_1.StatProfile)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UserProfileService);
exports.UserProfileService = UserProfileService;
//# sourceMappingURL=user-profile.service.js.map