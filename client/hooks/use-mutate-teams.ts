import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { client } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export const useMutateTeams = () => {
  const router = useRouter();

  const createTeam = async ({ name, slug }: { name: string; slug: string }) => {
    try {
      const { data } = await client.post("/createTeam", {
        name,
        slug,
      });

      toast.success("Team created successfully!");
      router.push(`/teams/${data.slug}/products`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  const createTeamMutation = useMutation({
    mutationFn: createTeam,
  });

  const joinTeam = async ({ slug }: { slug: string }) => {
    try {
      await client.post("/joinTeam", {
        slug,
      });

      toast.success("Successfully joined team!");
      router.push(`/teams/${slug}/products`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  const joinTeamMutation = useMutation({
    mutationFn: joinTeam,
  });

  return {
    createTeamMutation,
    joinTeamMutation,
  };
};
