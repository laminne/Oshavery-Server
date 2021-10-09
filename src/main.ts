import express from "express";
import cors from "cors";
import Log4js from "log4js";
import jwt from "express-jwt";
import jwksRsa from "jwks-rsa";
import dotenv from "dotenv";
import chalk from "chalk";

import {router_info} from "./routes/info";
import {router_auth} from "./routes/auth";
import {router_user} from "./routes/user";
import {router_guild} from "./routes/guild";
import {router_channel} from "./routes/channel";
import {router_message} from "./routes/message";
import {router_media} from "./routes/media";

const app: express.Express = express();
const GIT_COMMIT_HASH = process.env.GIT_COMMIT_HASH;
app.use(cors());
app.use(express.json());
Log4js.configure("log-config.json");
export const logger = Log4js.getLogger("system");
export const conf = dotenv.config();

if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_AUDIENCE) {
  throw new Error('Make sure you have AUTH0_DOMAIN, and AUTH0_AUDIENCE in your .env file');
}

export const checkJwt = jwt({
  // Dynamically provide a signing key based on the [Key ID](https://tools.ietf.org/html/rfc7515#section-4.1.4) header parameter ("kid") and the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: process.env.AUTH0_AUDIENCE,
  issuer: [`https://${process.env.AUTH0_DOMAIN}/`],
  algorithms: ['RS256']
});

if (process.env.NODE_ENV === "production"){
  app.use("/", router_info);
  app.use("/users", checkJwt, router_user);
  app.use("/guilds", checkJwt, router_guild);
  app.use("/", checkJwt, router_channel);
  app.use("/channels", checkJwt, router_channel);
  app.use("/files", checkJwt, router_media);
}else {
  app.use("/", router_info);
  app.use("/users", router_user);
  app.use("/guilds", router_guild);
  app.use("/", router_channel);
  app.use("/channels", router_message);
  app.use("/files", router_media);
  app.use("/", router_auth);
  console.log(chalk.red("Now Working On ") + chalk.red.bold("*DEVELOP MODE*") + chalk.red(". Server ") + chalk.red.bold("*WILL NOT* ask for an authentication token."));
}

app.listen(3080,() => {
  console.log(chalk.red("░█████╗") + chalk.green("░░██████╗") + chalk.yellow("██╗░░██╗") + chalk.blue("░█████╗") + chalk.magenta("░██╗░░░██╗") + chalk.cyan("███████╗") + chalk.black("██████") + chalk.white("╗░██╗░░░██╗"))
  console.log(chalk.red("██╔══██╗")+ chalk.green("██╔════╝")  + chalk.yellow("██║░░██║") + chalk.blue("██╔══██╗") + chalk.magenta("██║░░░██║") + chalk.cyan("██╔════╝") + chalk.black("██")+ chalk.white("╔══") + chalk.black("██") + chalk.white("╗╚██╗░██╔╝"));
  console.log(chalk.red("██║░░██║")+ chalk.green("╚█████╗")  + chalk.yellow("░███████║") + chalk.blue("███████║") + chalk.magenta("╚██╗░██╔╝") + chalk.cyan("█████╗") + chalk.black("░░██████")+ chalk.white("╔╝░╚████╔╝░"));
  console.log(chalk.red("██║░░██║")+ chalk.green("░╚═══██╗")  + chalk.yellow("██╔══██║") + chalk.blue("██╔══██║") + chalk.magenta("░╚████╔╝") + chalk.cyan("░██╔══╝░░") + chalk.black("██")+ chalk.white("╔══") + chalk.black("██") + chalk.white("╗░░╚██╔╝░░"));
  console.log(chalk.red("╚█████╔╝")+ chalk.green("██████╔╝")  + chalk.yellow("██║░░██║") + chalk.blue("██║░░██║") + chalk.magenta("░░╚██╔╝░░") + chalk.cyan("███████╗") + chalk.black("██")+ chalk.white("║") + chalk.black("░░██") + chalk.white("║░░░██║░░░"));
  console.log(chalk.red("░╚════╝░")+ chalk.green("╚═════╝░")  + chalk.yellow("╚═╝░░╚═╝") + chalk.blue("╚═╝░░╚═╝") + chalk.magenta("░░░╚═╝░░░") + chalk.cyan("╚══════╝") + chalk.white("╚═╝") + chalk.black("░░") + chalk.white("╚═╝░░░╚═╝░░░"));

  console.log("\nOshavery(alpha) Revision " +  GIT_COMMIT_HASH + "\n(c) 2021 Oshavery Developers");
  logger.info("Server listening at http://localhost:3080")
});
