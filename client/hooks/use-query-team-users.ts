import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/axios";
import { QueryKey } from "@/lib/consts";
import { User } from "@/lib/entities";

export const useQueryTeamUsers = (teamId: string) => {
  const getTeamUsers = async () => {
    const { data } = await client.get<User[]>("/getTeamUsersByTeamId", {
      params: {
        teamId,
      },
    });

    return data;
  };

  return useQuery({
    queryKey: [QueryKey.GET_TEAM_USERS_BY_TEAM_ID, teamId],
    queryFn: getTeamUsers,
  });
};
