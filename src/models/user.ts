import { PrismaClient } from "@prisma/client";
import { logger } from "../main";
const prisma = new PrismaClient();

export interface register {
  name: string;
  avatar: string;
  sub: string;
}

export interface user {
  id: string,
  name: string,
  bot: boolean,
  avatarurl: string,
  password: string
}

export class UserNotFoundError extends Error{}

export const users = {
  //GET
  // /users/:userId
  async get(user_id: string) {

    let resp:user ={
      id: "",
      name: "",
      bot: true,
      avatarurl: "",
      password: ""
    }

    const res = await prisma.users.findUnique({
      where: {
        id: user_id
      }
    }).catch((e) => {return logger.error(e);});

    if (!res){
      return resp;
    }
    else {
      return resp = {
        id: res.id,
        name: res.name,
        bot: res.bot,
        avatarurl: res.avatarurl,
        password: res.password
      };
    }

  },

  // Auth0からのユーザーIDで検索する関数(廃止予定)
  async getFromSub(sub: string) {
    const user =  await prisma.users.findUnique({
      where: {
        sub: sub
      }
    })

    if (!user){
      throw new UserNotFoundError()
    }else {
      return user;
    }
  },

  async getAllUsers() {
    return await prisma.users.findMany();
  },

  async createUserAccount(data: register) {
    return await prisma.users.create({
      data: {
        name: data.name,
        bot: false,
        origin: "oshavery-app.net", // ToDo: オリジンの設定を変更できるようにする
        sub: data.sub,
        avatarurl: data.avatar,
        password: ""
      }
    });

  },

  async updateUser(id: string, name:string) {
    return await prisma.users.update({
      where: {id: id},
      data:{
        name: name
      }
    });
  }
}
