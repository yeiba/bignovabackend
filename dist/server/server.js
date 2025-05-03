"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const expressApp_1 = __importDefault(require("./expressApp"));
const config_1 = __importDefault(require("../config"));
const inspector_1 = require("inspector");
dotenv_1.default.config(); // Load environment variables
// Constants
const PORT = config_1.default.PORT;
// Start the Express server
const startServer = () => {
    expressApp_1.default.listen(PORT, () => {
        inspector_1.console.log(`Server is running at http://localhost:${PORT}`);
    });
};
exports.default = startServer;
//# sourceMappingURL=server.js.map