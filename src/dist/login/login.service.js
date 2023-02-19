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
exports.LoginService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("../user-profile/user.entity");
const jwt_1 = require("@nestjs/jwt");
const typeorm_2 = require("@nestjs/typeorm");
const user_profile_status_model_1 = require("../user-profile/user-profile-status.model");
let LoginService = class LoginService {
    constructor(userProfileEntityRepos, jwtService) {
        this.userProfileEntityRepos = userProfileEntityRepos;
        this.jwtService = jwtService;
    }
    async createUser(authCredentialsDto) {
        const { username, password, eMail } = authCredentialsDto;
        console.log(authCredentialsDto);
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const _user = this.userProfileEntityRepos.create({
            username,
            password: hashedPassword,
            eMail,
            status: user_profile_status_model_1.UserStatus.CREATION
        });
        console.log(_user);
        try {
            await this.userProfileEntityRepos.save(_user);
        }
        catch (error) {
            console.log(`error "${error.code}`);
            if (error.code === '23505') {
                throw new common_1.ConflictException(`account name/email "${username} was already in use1`);
            }
            else {
                throw new common_1.InternalServerErrorException(`account name/email "${error.code} was already in use, but the error is different`);
            }
        }
        return _user;
    }
    async signIn(authCredentialsDto) {
        const { username, password } = authCredentialsDto;
        const user = await this.userProfileEntityRepos.findOneBy({ username });
        if (user && (await bcrypt.compare(password, user.password))) {
            const payload = { username };
            const accessToken = await this.jwtService.sign(payload);
            return { accessToken };
        }
        else {
            throw new common_1.UnauthorizedException('Please check your login credentials');
        }
    }
};
LoginService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_entity_1.UserProfile)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        jwt_1.JwtService])
], LoginService);
exports.LoginService = LoginService;
//# sourceMappingURL=login.service.js.map