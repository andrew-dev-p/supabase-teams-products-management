import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/axios";
import { Product } from "@/lib/entities";
import { QueryKey } from "@/lib/consts";
import { Status } from "@/lib/entities";

export const useQueryProducts = (
  teamId: string,
  search: string,
  status: Status | "all",
  page: number,
  perPage = 10,
  selectedUserId: string
) => {
  return useQuery({
    queryKey: [
      QueryKey.GET_PRODUCTS,
      teamId,
      { search, status, page, perPage, selectedUserId },
    ],
    queryFn: async () => {
      const { data } = await client.get<{
        products: Product[];
        totalPages: number;
      }>("/getProducts", {
        params: {
          team_id: teamId,
          search,
          status: status === "all" ? undefined : status,
          page,
          per_page: perPage,
          created_by: selectedUserId,
        },
      });

      return data;
    },
    enabled: !!teamId,
  });
};
