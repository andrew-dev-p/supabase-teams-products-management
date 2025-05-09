import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/axios";
import { QueryKey } from "@/lib/consts";

export const useQueryTeamById = (id: string, options = {}) => {
  const getTeam = async () => {
    const { data } = await client.get("/getTeamById", {
      params: {
        id,
      },
    });

    return data;
  };

  return useQuery({
    queryKey: [QueryKey.GET_TEAM_BY_ID, id],
    queryFn: getTeam,
    ...options,
  });
};
