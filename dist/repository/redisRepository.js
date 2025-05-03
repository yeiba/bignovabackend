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
exports.RedisRepository = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
class RedisRepository {
    /**
     * Initializes and returns the Redis client using Singleton pattern
     * @returns Redis client instance
     */
    static initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.redisClient) {
                console.log("Reusing existing Redis connection...");
                return this.redisClient;
            }
            try {
                const redisHost = process.env.REDIS_HOST || "redis_one";
                const redisPort = parseInt(process.env.REDIS_PORT || "6379", 10);
                // Create a new Redis client instance
                this.redisClient = new ioredis_1.default({
                    host: redisHost,
                    port: redisPort,
                });
                // Handle connection errors
                this.redisClient.on("error", (err) => {
                    console.error("Redis Cache Client Connection Error:", err);
                });
                console.log("Redis cache app database connected...");
                return this.redisClient;
            }
            catch (error) {
                console.error("Failed to connect to Redis:", error);
                throw new Error("Failed to initialize Redis client.");
            }
        });
    }
    /**
     * Create or update a key-value pair in Redis
     * @param key - The key
     * @param value - The value to set
     * @param ttl - Optional time-to-live in seconds
     */
    static set(key, value, ttl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield this.initialize();
                const data = typeof value === "object" ? JSON.stringify(value) : value;
                if (ttl) {
                    yield client.set(key, data, "EX", ttl);
                }
                else {
                    yield client.set(key, data);
                }
                console.log(`Key "${key}" set successfully.`);
            }
            catch (error) {
                throw new Error("Failed to set key in Redis: " + error.message);
            }
        });
    }
    /**
     * Get a value from Redis by key
     * @param key - The key to retrieve
     * @returns The value or undefined if the key does not exist
     */
    static get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield this.initialize();
                const data = yield client.get(key);
                if (data) {
                    try {
                        return JSON.parse(data);
                    }
                    catch (_a) {
                        return data; // Return as string if not JSON
                    }
                }
                return undefined;
            }
            catch (error) {
                throw new Error("Failed to get key from Redis: " + error.message);
            }
        });
    }
    /**
     * Delete a key from Redis
     * @param key - The key to delete
     * @returns True if the key was deleted, false otherwise
     */
    static delete(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield this.initialize();
                const result = yield client.del(key);
                return result > 0;
            }
            catch (error) {
                throw new Error("Failed to delete key from Redis: " + error.message);
            }
        });
    }
    /**
     * Check if a key exists in Redis
     * @param key - The key to check
     * @returns True if the key exists, false otherwise
     */
    static exists(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield this.initialize();
                const result = yield client.exists(key);
                return result > 0;
            }
            catch (error) {
                throw new Error("Failed to check key existence in Redis: " + error.message);
            }
        });
    }
    /**
     * Update the TTL (time-to-live) of a key
     * @param key - The key to update
     * @param ttl - The new TTL in seconds
     * @returns True if the TTL was updated, false otherwise
     */
    static expire(key, ttl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield this.initialize();
                const result = yield client.expire(key, ttl);
                return result > 0;
            }
            catch (error) {
                throw new Error("Failed to update TTL in Redis: " + error.message);
            }
        });
    }
    /**
     * Get all keys matching a pattern
     * @param pattern - The pattern to match keys (e.g., "user:*")
     * @returns Array of matching keys
     */
    static keys(pattern) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield this.initialize();
                return yield client.keys(pattern);
            }
            catch (error) {
                throw new Error("Failed to retrieve keys from Redis: " + error.message);
            }
        });
    }
}
exports.RedisRepository = RedisRepository;
RedisRepository.redisClient = null;
