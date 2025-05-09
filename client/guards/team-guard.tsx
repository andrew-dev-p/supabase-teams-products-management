"use client";

import { useQueryCurrentUser } from "@/hooks/use-query-current-user";
import { useQueryTeamById } from "@/hooks/use-query-team-by-id";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const TeamGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const { data: currentUser } = useQueryCurrentUser();

  const { data: team } = useQueryTeamById(currentUser?.team_id, {
    enabled: !!currentUser?.team_id,
  });

  useEffect(() => {
    if (team) {
      router.push(`/teams/${team.slug}/products`);
    }
  }, [team, router]);

  return children;
};

export default TeamGuard;
