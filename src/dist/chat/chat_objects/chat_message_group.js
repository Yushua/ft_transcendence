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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessageGroup = void 0;
const typeorm_1 = require("typeorm");
let ChatMessageGroup = class ChatMessageGroup {
};
ChatMessageGroup.MaxMessageCount = 10;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ unique: true }),
    __metadata("design:type", String)
], ChatMessageGroup.prototype, "ID", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-array"),
    __metadata("design:type", Array)
], ChatMessageGroup.prototype, "Content", void 0);
ChatMessageGroup = __decorate([
    (0, typeorm_1.Entity)()
], ChatMessageGroup);
exports.ChatMessageGroup = ChatMessageGroup;
//# sourceMappingURL=chat_message_group.js.map