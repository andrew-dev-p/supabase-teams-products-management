import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { client } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Status } from "@/lib/entities";
import { QueryKey } from "@/lib/consts";

export const useMutateProducts = (teamId: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createProduct = async ({
    title,
    description,
    picture,
    slug,
  }: {
    title: string;
    description: string;
    picture: string;
    slug: string;
  }) => {
    try {
      const { data } = await client.post("/createProduct", {
        product: {
          title,
          description,
          picture,
          team_id: teamId,
        },
      });

      toast.success("Product created successfully!");
      router.push(`/teams/${slug}/products/${data.id}`);
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_PRODUCTS, { teamId }],
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  const createProductMutation = useMutation({
    mutationFn: createProduct,
  });

  const updateProduct = async ({
    id,
    title,
    description,
    picture,
    status,
  }: {
    id: string;
    title?: string;
    description?: string;
    picture?: string;
    status?: Status;
  }) => {
    try {
      await client.patch("/updateProduct", {
        product: {
          id,
          title,
          description,
          picture,
          status,
        },
      });

      toast.success("Product updated successfully!");
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_PRODUCTS, { teamId }],
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  const updateProductMutation = useMutation({
    mutationFn: updateProduct,
  });

  return {
    createProductMutation,
    updateProductMutation,
  };
};
