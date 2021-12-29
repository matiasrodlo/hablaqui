import { logger } from "./config/pino";
const app = require("./app");

app.listen(process.env.PORT, () => {
  logger.info(`Listen on port ${process.env.PORT}`);
});
