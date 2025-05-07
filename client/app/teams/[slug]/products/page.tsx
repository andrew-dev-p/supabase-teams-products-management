"use client";

import TeamPageLayout from "@/components/team-page-layout/team-page-layout";
import { useParams } from "next/navigation";
import { useQueryTeam } from "@/hooks/use-query-team";

const TeamPage = () => {
  const params = useParams();
  const slug = params.slug;

  const getTeamQuery = useQueryTeam(slug as string);

  return (
    <TeamPageLayout team={getTeamQuery.data}>
      some products are gonna be displayed here
    </TeamPageLayout>
  );
};

export default TeamPage;
