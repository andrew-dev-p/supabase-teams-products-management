import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { client } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { Team } from "@/lib/entities";

export const useMutateProducts = () => {
  const router = useRouter();

  const createProduct = async ({
    title,
    description,
    picture,
    team,
  }: {
    title: string;
    description: string;
    picture: string;
    team: Team;
  }) => {
    try {
      const { data } = await client.post("/createProduct", {
        product: {
          title,
          description,
          picture,
          team_id: team.id,
        },
      });

      toast.success("Product created successfully!");
      router.push(`/teams/${team.slug}/products/${data.id}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  const createProductMutation = useMutation({
    mutationFn: createProduct,
  });

  return {
    createProductMutation,
  };
};
