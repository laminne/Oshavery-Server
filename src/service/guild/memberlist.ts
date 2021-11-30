import { searchJoinedGuildMembers } from "../../repositories/guild";
import { users } from "../../models/user";

type User = {
  id: string;
  name: string;
  bot: boolean;
  avatarurl: string;
};

export default async function (id: string) {
  // ギルドのメンバーリストを取得
  const GuildMembers = await searchJoinedGuildMembers(id);
  if (GuildMembers.length === 0) {
    return null;
  } else {
    // eslint-disable-next-line
    let GuildMembersData = Array<User>();
    // Todo: for v in はJSのループの中で一番速いが,中身がAwaitで非効率なのでPromise.allか何かに変更する
    // eslint-disable-next-line
    for (let i in GuildMembers) {
      GuildMembersData[i] = await users.get(GuildMembers[i].id);
    }
    return GuildMembersData;
  }
}
