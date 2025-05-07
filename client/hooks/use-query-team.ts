import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/axios";
import { QueryKey } from "@/lib/consts";

export const useQueryTeam = (slug: string) => {
  const getTeam = async () => {
    const { data } = await client.get("/getTeamBySlug", {
      params: {
        slug,
      },
    });

    return data;
  };

  return useQuery({
    queryKey: [QueryKey.GET_TEAM_BY_SLUG, slug],
    queryFn: getTeam,
  });
};
