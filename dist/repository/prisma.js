"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const config_1 = __importDefault(require("../config"));
const globalFromPrisma = global;
exports.prisma = globalFromPrisma.prisma || new client_1.PrismaClient({ log: ["query"] });
if (config_1.default.NODE_ENV !== "production")
    globalFromPrisma.prisma = exports.prisma;
//# sourceMappingURL=prisma.js.map