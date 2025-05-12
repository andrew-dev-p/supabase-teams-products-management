import { client } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKey } from "@/lib/consts";

export const useMutateUser = () => {
  const queryClient = useQueryClient();

  const createUser = async ({
    name,
    email,
    profile_picture,
  }: {
    name: string;
    email: string;
    profile_picture: string;
  }) => {
    try {
      await client.post("/createUser", {
        name,
        email,
        profile_picture,
      });

      toast.success("User created successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  const createUserMutation = useMutation({
    mutationFn: createUser,
  });

  const editUser = async ({
    name,
    email,
    profile_picture,
  }: {
    name: string;
    email: string;
    profile_picture: string;
  }) => {
    try {
      await client.patch("/editUser", {
        name,
        email,
        profile_picture,
      });

      toast.success("User updated successfully!");
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_TEAM_USERS_BY_TEAM_ID],
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  const editUserMutation = useMutation({
    mutationFn: editUser,
  });

  return {
    createUserMutation,
    editUserMutation,
  };
};
