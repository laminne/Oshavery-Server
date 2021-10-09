import express from "express";
import {login} from "../controllers/auth/login";

export const router_auth = express.Router();

router_auth.route("/login")
  .post(login);

router_auth.route("/logout")
  .post()
