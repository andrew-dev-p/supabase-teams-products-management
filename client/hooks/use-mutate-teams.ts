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
      router.push(`/teams/${data.slug}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  const createTeamMutation = useMutation({
    mutationFn: createTeam,
  });

  return {
    createTeamMutation,
  };
};
