import { Config } from "./application/config";
import { logger } from "./application/logger";
import { web } from "./application/web";

function main() {
  const port = Config.get("PORT");

  web.listen(port, () => {
    logger.info(`server listening on port: ${port}`);
  });
}

main();
