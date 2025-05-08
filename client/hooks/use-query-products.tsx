import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/axios";
import { Product } from "@/lib/entities";
import { QueryKey } from "@/lib/consts";

export const useQueryProducts = (teamId: string) => {
  return useQuery({
    queryKey: [QueryKey.GET_PRODUCTS, teamId],
    queryFn: async () => {
      const { data } = await client.get<Product[]>("/getProducts", {
        params: {
          team_id: teamId,
        },
      });

      return data;
    },
    enabled: !!teamId,
  });
};
