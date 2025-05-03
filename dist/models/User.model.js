"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.UserSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: [true, "Please provide unique Username"],
        unique: [true, "Username Exist"],
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        unique: false,
        minlength: 8,
    },
    email: {
        type: String,
        required: [true, "Please provide a unique email"],
        unique: true,
        lowercase: true,
    },
    firstName: { type: String },
    lastName: { type: String },
    mobile: { type: Number },
    address: { type: String },
    profile: { type: String },
    date: { type: Date, default: Date.now },
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });
exports.UserSchema.virtual("dateInDays").get(function () {
    return this.date;
});
exports.UserSchema.pre("save", function (next) {
    console.log(this);
    next();
});
exports.UserSchema.post("save", function (doc, next) {
    console.log(doc);
    next();
});
exports.UserSchema.pre(/^find/, function (next) {
    console.log(this);
    next();
});
const User = mongoose_1.default.models.User || mongoose_1.default.model("User", exports.UserSchema);
exports.default = User;
