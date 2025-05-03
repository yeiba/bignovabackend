"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3BucketRepository = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const config_1 = __importDefault(require("../config"));
class S3BucketRepository {
    static initializeS3() {
        if (!this.s3) {
            this.s3 = new client_s3_1.S3Client({
                credentials: {
                    accessKeyId: config_1.default.AWS_ACCESS_KEY_ID,
                    secretAccessKey: config_1.default.AWS_SECRET_ACCESS_KEY,
                },
                region: config_1.default.AWS_REGION,
            });
            console.log("S3 Client initialized.");
        }
    }
}
exports.S3BucketRepository = S3BucketRepository;
