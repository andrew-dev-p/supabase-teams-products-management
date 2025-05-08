import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/axios";
import { Product } from "@/lib/entities";
import { QueryKey } from "@/lib/consts";
import { Status } from "@/lib/entities";

export const useQueryProducts = (
  teamId: string,
  search: string,
  status: Status | "all"
) => {
  return useQuery({
    queryKey: [QueryKey.GET_PRODUCTS, teamId, { search, status }],
    queryFn: async () => {
      console.log("hook: ", search);

      const { data } = await client.get<Product[]>("/getProducts", {
        params: {
          team_id: teamId,
          search,
          status: status === "all" ? undefined : status,
        },
      });

      return data;
    },
    enabled: !!teamId,
  });
};
