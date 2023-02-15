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
var ChatMessageGroupManager_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessage = exports.ChatMessageGroupManager = void 0;
const typeorm_1 = require("typeorm");
let ChatMessageGroupManager = ChatMessageGroupManager_1 = class ChatMessageGroupManager {
    GetMessage(index) {
        if (!Number.isInteger(index))
            throw `Not an integer: ${index}`;
        if (index < 0 || index >= this.MessageCount)
            throw `Out of bounds: ${index} isn't within 0 and ${this.MessageCount}`;
        return new ChatMessage(this.OwnerIDs[index], this.Messages[index]);
    }
    AddMessage(message) {
        if (this.MessageCount >= ChatMessageGroupManager_1.MaxMessageCount)
            return false;
        this.OwnerIDs.push(message.OwnerID);
        this.Messages.push(message.Message);
        this.MessageCount += 1;
        return true;
    }
    ToMessages() {
        const messages = [];
        for (let i = 0; i < this.MessageCount; i++)
            messages.push(new ChatMessage(this.OwnerIDs[i], this.Messages[i]));
        return messages;
    }
};
ChatMessageGroupManager.MaxMessageCount = 20;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ unique: true }),
    __metadata("design:type", String)
], ChatMessageGroupManager.prototype, "ID", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ChatMessageGroupManager.prototype, "MessageCount", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { array: true }),
    __metadata("design:type", Array)
], ChatMessageGroupManager.prototype, "OwnerIDs", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { array: true }),
    __metadata("design:type", Array)
], ChatMessageGroupManager.prototype, "Messages", void 0);
ChatMessageGroupManager = ChatMessageGroupManager_1 = __decorate([
    (0, typeorm_1.Entity)()
], ChatMessageGroupManager);
exports.ChatMessageGroupManager = ChatMessageGroupManager;
class ChatMessage {
    constructor(OwnerID, Message) {
        this.OwnerID = OwnerID;
        this.Message = Message;
    }
}
exports.ChatMessage = ChatMessage;
//# sourceMappingURL=chat_message.js.map