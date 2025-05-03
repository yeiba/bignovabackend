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
exports.ElasticsearchRepository = void 0;
// @ts-ignore
const elasticsearch_1 = require("@elastic/elasticsearch");
const config_1 = __importDefault(require("../config"));
const ELASTICSEARCH_URI = config_1.default.ELASTICSEARCH_URI;
// const ELASTICSEARCH_URI = "http://elasticsearch:9200";
class ElasticsearchRepository {
    /**
     * Initialize the Elasticsearch client
     */
    static initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.clientInstance) {
                console.log("Reusing existing Elasticsearch connection...");
                return this.clientInstance;
            }
            try {
                this.clientInstance = new elasticsearch_1.Client({ node: ELASTICSEARCH_URI });
                console.log("Elasticsearch connected...");
                return this.clientInstance;
            }
            catch (error) {
                console.error("Error connecting to Elasticsearch:", error);
                throw new Error("Failed to connect to Elasticsearch");
            }
        });
    }
    static searchIndex(index) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield this.initialize();
                const response = yield client.search({
                    index: index,
                    body: {
                        query: { match_all: {} },
                    },
                });
                const results = response.body.hits.hits.map((hit) => (Object.assign({ _id: hit._id }, hit._source)));
                // console.log("Elasticsearch response:", JSON.stringify(response, null, 2));
                return JSON.stringify(results, null, 2);
            }
            catch (error) {
                throw new Error("Failed to search index: " + error.message);
            }
        });
    }
    static searchByWordInFields(index, fields, value) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const client = yield this.initialize();
                const response = yield client.search({
                    index,
                    body: {
                        query: {
                            multi_match: {
                                query: value,
                                fields: fields, // Fields to search
                                fuzziness: "AUTO", // Automatically adjusts for minor typos
                            },
                        },
                    },
                });
                // Extract all matching documents from the response
                const results = response.body.hits.hits.map((hit) => (Object.assign({ _id: hit._id }, hit._source)));
                // return JSON.stringify(response.body.hits.hits, null, 2); // Return all matching results
                return JSON.stringify(results, null, 2); // Return all matching results
            }
            catch (error) {
                if (((_a = error.meta) === null || _a === void 0 ? void 0 : _a.statusCode) === 404) {
                    return []; // Return an empty array if no results found
                }
                throw new Error("Failed to find documents: " + error.message);
            }
        });
    }
    static searchByFields(index, fields, // Array of field names
    value) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const client = yield this.initialize();
                const response = yield client.search({
                    index,
                    body: {
                        query: {
                            multi_match: {
                                query: value, // The value to search for
                                fields, // Array of fields to search
                                type: "phrase_prefix", // Options: "best_fields", "most_fields", "phrase", etc.
                            },
                        },
                    },
                });
                const results = response.body.hits.hits.map((hit) => (Object.assign({ _id: hit._id }, hit._source)));
                return JSON.stringify(results, null, 2); // Return the exact search hits
            }
            catch (error) {
                if (((_a = error.meta) === null || _a === void 0 ? void 0 : _a.statusCode) === 404) {
                    return undefined; // Return undefined if no results found
                }
                throw new Error("Failed to find documents: " + error.message);
            }
        });
    }
    /**
     * Find a document by its ID
     * @param index - index
     * @param field - index
     * @param value - index
     */
    static findByField(index, field, value) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const client = yield this.initialize();
                const response = yield client.search({
                    index,
                    body: {
                        query: {
                            term: {
                                // Exact match query
                                [`${field}.keyword`]: value, // Use the .keyword subfield for exact match
                            },
                        },
                    },
                });
                const results = response.body.hits.hits.map((hit) => (Object.assign({ _id: hit._id }, hit._source)));
                return JSON.stringify(results, null, 2); // Return the search hits
            }
            catch (error) {
                if (((_a = error.meta) === null || _a === void 0 ? void 0 : _a.statusCode) === 404) {
                    return undefined;
                }
                throw new Error("Failed to find document: " + error.message);
            }
        });
    }
    static FindeById(index, id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const client = yield this.initialize();
                const response = yield client.get({
                    index,
                    id,
                });
                const results = Object.assign({ _id: response.body._id }, response.body._source);
                return JSON.stringify(results, null, 2); // Return the exact search hits
            }
            catch (error) {
                if (((_a = error.meta) === null || _a === void 0 ? void 0 : _a.statusCode) === 404) {
                    return undefined; // Return undefined if no results found
                }
                throw new Error("Failed to find document: " + error.message);
            }
        });
    }
    /**
     * Create or index a document
     * @param id - Document ID
     * @param data - Document data
     * @param index - index
     */
    static createDocument(id, data, index) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield this.initialize();
                const response = yield client.index({
                    index: index,
                    id,
                    document: data,
                });
                yield client.indices.refresh({ index: index });
                return response;
            }
            catch (error) {
                throw new Error("Failed to create document: " + error.message);
            }
        });
    }
}
exports.ElasticsearchRepository = ElasticsearchRepository;
ElasticsearchRepository.clientInstance = null;
