import jwt from "jsonwebtoken";
import express from "express";

export async function verifyToken(req:express.Request, res:express.Response, next:express.NextFunction){
  const token = req.headers["authorization"];

  // トークンがあるか
  if (!token){
    res.status(400).send("Invalid request")
  }else {
    // ヘッダの中身がベアラーか
    if (token.split(" ")[0] === "Bearer") {
      try {
        // トークンを検証
        const jwtToken = jwt.verify(token.split(" ")[1], "123");

        next();

      } catch (e) {
        res.status(401).send("Authorization failed")
      }
    }else {
      res.status(400).send("Invalid request")
    }
  }

}
