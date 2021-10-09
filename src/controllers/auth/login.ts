import express from "express";
// import  {logger} from "../../main";
import {users} from "../../models/user";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

export type login_data = {
  username: string,
  password: string
}

export type response_data = {
  token: string
}

export async function login(req: express.Request, res: express.Response){
  const login_data: login_data = {
    username: req.body.username,
    password: req.body.password
  }



  // user情報を読み出す
  const user = await users.get(login_data.username);

  const compare = await bcrypt.compare(login_data.password, user.password);
  if (compare){
    const token = jwt.sign({uid: user.id, uname: user.name}, "123", {expiresIn: '1h'});

    const res_data: response_data = {
      token: token
    }

    res.json(res_data);

  }else {
    res.status(400).send("Invalid request")
  }

}
