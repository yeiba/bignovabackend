import dotenv from "dotenv";
import expressApp from "./expressApp";
import config from "../config";
import { console } from "inspector";
dotenv.config(); // Load environment variables

// Constants
const PORT = config.PORT;

// Start the Express server
const startServer = () => {
  expressApp.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
};

export default startServer;
