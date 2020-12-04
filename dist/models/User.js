"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const withMongooseFields_1 = require("src/mongoose/withMongooseFields");
const Schema = new mongoose_1.default.Schema(Object.assign(Object.assign({ name: {
        type: String,
        description: 'User name',
        trim: true,
    }, surname: {
        type: String,
        description: 'User surname',
        trim: true,
    }, password: {
        type: String,
        hidden: true,
    }, email: {
        type: String,
        description: 'User email to be used on login',
        trim: true,
        index: true,
    } }, withMongooseFields_1.isActiveMongooseField), withMongooseFields_1.removedAtMongooseField));
const UserModel = mongoose_1.default.model('User', Schema);
exports.default = UserModel;
//# sourceMappingURL=User.js.map