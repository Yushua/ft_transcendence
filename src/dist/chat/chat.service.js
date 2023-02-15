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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const chat_message_1 = require("./chat_objects/chat_message");
const chat_room_1 = require("./chat_objects/chat_room");
const chat_user_1 = require("./chat_objects/chat_user");
let ChatService = class ChatService {
    constructor(chatRoomRepo, chatMessageRepo, chatUserRepo) {
        this.chatRoomRepo = chatRoomRepo;
        this.chatMessageRepo = chatMessageRepo;
        this.chatUserRepo = chatUserRepo;
    }
    async _getMsgID(roomID, index) {
        if (index < 0)
            index = (await this.GetRoom(roomID)).MessageGroupDepth + index + 1;
        return `${roomID}__${index}`;
    }
    async _addMessageGroup(roomID) {
        const msgGroup = await this.chatMessageRepo.create({
            ID: roomID,
            OwnerIDs: [],
            Messages: [],
            MessageCount: 0
        });
        return await this.chatMessageRepo.save(msgGroup);
    }
    async NewRoom(roomDTO) {
        const { OwnerID, Password, RoomType } = roomDTO;
        var room = await this.chatRoomRepo.create({
            OwnerID, Password, RoomType: +chat_room_1.ChatRoomType[RoomType],
            MemberIDs: [OwnerID], AdminIDs: [OwnerID], BlackList: [],
            MessageGroupDepth: 0
        });
        room = await this.chatRoomRepo.save(room);
        await this.ModifyUser(OwnerID, user => { user.ChatRoomsIn.push(room.ID); });
        return room;
    }
    async GetMessages(roomID, index) {
        if (!Number.isInteger(index))
            throw `${index} is not an integer`;
        const msgGroupManager = await this.chatMessageRepo.findOneBy({ ID: await this._getMsgID(roomID, index) });
        if (!msgGroupManager)
            return [];
        return msgGroupManager.ToMessages();
    }
    async PostNewMessage(roomID, msgDTO) {
        const { OwnerID, Message } = msgDTO;
        const msg = new chat_message_1.ChatMessage(OwnerID, Message);
        const room = await this.GetRoom(roomID);
        var depth = room.MessageGroupDepth;
        var msgGroup = await this.chatMessageRepo.findOneBy({ ID: await this._getMsgID(room.ID, depth) });
        if (!msgGroup || !msgGroup.AddMessage(msg)) {
            depth = (room.MessageGroupDepth += 1);
            await this.chatRoomRepo.save(room);
            msgGroup = await this._addMessageGroup(await this._getMsgID(room.ID, depth));
            msgGroup.AddMessage(msg);
        }
        await this.chatMessageRepo.save(msgGroup);
        return msgGroup.ID;
    }
    async AddUserToRoom(roomID, userID) {
        await this.ModifyRoom(roomID, async (room) => {
            if (!room.MemberIDs.includes(userID)) {
                room.MemberIDs.push(userID);
                await this.ModifyUser(userID, user => {
                    user.ChatRoomsIn.push(roomID);
                });
            }
        });
    }
    async GetRoom(roomID) { return this.chatRoomRepo.findOneBy({ ID: roomID }); }
    async ModifyRoom(roomID, func) {
        const room = await this.GetRoom(roomID);
        func(room);
        return await this.chatRoomRepo.save(room);
    }
    async DeleteRoom(roomID) {
        const room = await this.GetRoom(roomID);
        for (let i = 0; i < room.MessageGroupDepth; i++)
            this.chatMessageRepo.delete({ ID: await this._getMsgID(roomID, i + 1) });
        for (const userID of room.MemberIDs) {
            this.ModifyUser(userID, user => {
                const index = user.ChatRoomsIn.indexOf(roomID, 0);
                if (index > -1)
                    user.ChatRoomsIn.splice(index, 1);
            });
        }
        this.chatRoomRepo.remove(room);
    }
    async GetOrAddUser(userID) {
        var foudUser = await this.chatUserRepo.findOneBy({ ID: userID });
        if (foudUser)
            return foudUser;
        return await this.chatUserRepo.save(await this.chatUserRepo.create({ ID: userID, ChatRoomsIn: [], BlockedUserIDs: [] }));
    }
    async ModifyUser(ID, func) {
        var foudUser = await this.GetOrAddUser(ID);
        func(foudUser);
        return await this.chatUserRepo.save(foudUser);
    }
    async DeleteUser(userID) {
        const user = await this.chatUserRepo.findOneBy({ ID: userID });
        if (!user)
            return;
        const roomsToDelete = [];
        for (const roomID of user.ChatRoomsIn) {
            await this.ModifyRoom(roomID, room => {
                var index;
                index = room.MemberIDs.indexOf(userID, 0);
                if (index > -1)
                    room.MemberIDs.splice(index, 1);
                index = room.AdminIDs.indexOf(userID, 0);
                if (index > -1)
                    room.AdminIDs.splice(index, 1);
                if (room.OwnerID == userID) {
                    if (room.MemberIDs.length == 0)
                        roomsToDelete.push(roomID);
                    else
                        room.OwnerID = room.MemberIDs[0];
                }
            });
        }
        for (const roomID of roomsToDelete)
            await this.DeleteRoom(roomID);
        await this.chatUserRepo.remove(user);
    }
    async GetAllUsers() { return this.chatUserRepo.find(); }
    async GetAllRooms() { return this.chatRoomRepo.find(); }
    async DeleteAll() {
        this.chatRoomRepo.delete({});
        this.chatUserRepo.delete({});
        this.chatMessageRepo.delete({});
    }
};
ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chat_room_1.ChatRoom)),
    __param(1, (0, typeorm_1.InjectRepository)(chat_message_1.ChatMessageGroupManager)),
    __param(2, (0, typeorm_1.InjectRepository)(chat_user_1.ChatUser)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ChatService);
exports.ChatService = ChatService;
//# sourceMappingURL=chat.service.js.map