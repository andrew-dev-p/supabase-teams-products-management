import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/axios";
import { QueryKey } from "@/lib/consts";

export const useQueryCurrentUser = () => {
  const getCurrentUser = async () => {
    const { data } = await client.get("/getCurrentUser");
    return data;
  };

  return useQuery({
    queryKey: [QueryKey.GET_CURRENT_USER],
    queryFn: getCurrentUser,
  });
};
