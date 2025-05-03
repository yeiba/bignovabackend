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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongodbRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose"); // Ensure this is imported
const ObjectId = require("mongoose").Types.objectId;
class MongodbRepository {
    static initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.dbInstance) {
                console.log("Reusing existing MongoDB connection...");
                return this.dbInstance;
            }
            try {
                // MongoDB replica set connection string
                const mongoURL = process.env.MONGO_URL ||
                    "mongodb://mongo_one:27017,mongo_two:27017,mongo_three:27017/";
                // Mongoose settings
                mongoose_1.default.Promise = global.Promise; // Use global promises
                mongoose_1.default.set("strictQuery", true); // Enforce strict queries
                // Connect to MongoDB
                this.dbInstance = yield mongoose_1.default.connect(mongoURL);
                console.log("MongoDB app database connected...");
                return this.dbInstance;
            }
            catch (error) {
                console.error("Error connecting to MongoDB:", error);
                throw new Error("Failed to connect to MongoDB");
            }
        });
    }
    /**
     * Create a new document in a collection
     * @param model - Mongoose model
     * @param data - Data to be saved
     */
    static createDocument(model, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.initialize();
                const document = new model(data);
                yield document.save();
                return document !== null && document !== void 0 ? document : undefined;
            }
            catch (error) {
                throw new Error("Failed to create document: " + error.message);
            }
        });
    }
    /**
     * Find a document by its ID
     * @param model - Mongoose model
     * @param id - Document ID
     */
    static findById(model, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.initialize();
                const document = yield model.findById(id).exec();
                return document !== null && document !== void 0 ? document : undefined;
            }
            catch (error) {
                throw new Error("Failed to find document: " + error.message);
            }
        });
    }
    /**
     * Find a document by its ID
     * @param model - Mongoose model
     * @param fieldValue - Document ID
     */
    static findOne(model, fieldValue) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.initialize();
                const document = yield model.findOne(fieldValue).exec();
                return document !== null && document !== void 0 ? document : undefined;
            }
            catch (error) {
                throw new Error("Failed to find document: " + error.message);
            }
        });
    }
    /**
     * Update a document by its ID
     * @param model - Mongoose model
     * @param field - Document ID
     * @param data - Updated data
     */
    static updateById(model, id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.initialize();
                const updatedDocument = yield model
                    .findOneAndUpdate({ _id: new mongoose_2.Types.ObjectId(id) }, {
                    $set: data,
                }, {
                    new: true, // Return the updated document
                    // runValidators: true, // Apply validation to the updated data
                })
                    .exec();
                return updatedDocument !== null && updatedDocument !== void 0 ? updatedDocument : undefined;
            }
            catch (error) {
                throw new Error("Failed to update document: " + error.message);
            }
        });
    }
    /**
     * Delete a document by its ID
     * @param model - Mongoose model
     * @param id - Document ID
     */
    static deleteById(model, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.initialize();
                const deletedDocument = yield model.findOneAndDelete({ id }).exec();
                return deletedDocument !== null && deletedDocument !== void 0 ? deletedDocument : undefined;
            }
            catch (error) {
                throw new Error("Failed to delete document: " + error.message);
            }
        });
    }
}
exports.MongodbRepository = MongodbRepository;
MongodbRepository.dbInstance = null;
