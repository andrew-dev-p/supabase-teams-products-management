"use client";

import TeamPageLayout from "@/components/team-page-layout/team-page-layout";
import { useParams } from "next/navigation";

const TeamPage = () => {
  const params = useParams();
  const slug = params.slug;

  return <TeamPageLayout></TeamPageLayout>;
};

export default TeamPage;
