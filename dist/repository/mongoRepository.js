"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongodbRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class MongodbRepository {
    createDocument(model, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const document = yield model.create({ data });
                return document !== null && document !== void 0 ? document : undefined;
            }
            catch (error) {
                throw new Error("Failed to create document: " + error.message);
            }
        });
    }
    findById(model, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const document = yield model.findUnique({
                    where: { id: id },
                });
                return document !== null && document !== void 0 ? document : undefined;
            }
            catch (error) {
                throw new Error("Failed to find document: " + error.message);
            }
        });
    }
    findOne(model, fieldName, fieldValue) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const whereClause = { [fieldName]: fieldValue };
                const document = yield model.findFirst({
                    where: whereClause,
                });
                return document !== null && document !== void 0 ? document : undefined;
            }
            catch (error) {
                throw new Error("Failed to find document: " + error.message);
            }
        });
    }
    find(model, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (page && limit) {
                    const skip = (page - 1) * limit;
                    const documents = yield model.findMany({
                        skip,
                        take: limit,
                    });
                    return documents !== null && documents !== void 0 ? documents : undefined;
                }
                else {
                    const documents = yield model.findMany();
                    return documents !== null && documents !== void 0 ? documents : undefined;
                }
            }
            catch (error) {
                throw new Error("Failed to find all documents: " + error.message);
            }
        });
    }
    updateById(model, id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedDocument = yield model.update({
                    where: { id },
                    data,
                });
                return updatedDocument !== null && updatedDocument !== void 0 ? updatedDocument : undefined;
            }
            catch (error) {
                throw new Error("Failed to update document: " + error.message);
            }
        });
    }
    deleteById(model, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedDocument = yield model.delete({
                    where: { id },
                });
                return deletedDocument !== null && deletedDocument !== void 0 ? deletedDocument : undefined;
            }
            catch (error) {
                throw new Error("Failed to delete document: " + error.message);
            }
        });
    }
}
exports.MongodbRepository = MongodbRepository;
//# sourceMappingURL=mongoRepository.js.map