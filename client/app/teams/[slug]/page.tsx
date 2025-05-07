"use client";

import { useParams } from "next/navigation";

const TeamPage = () => {
  const params = useParams();
  const slug = params.slug;

  return <div>Team {slug}</div>;
};

export default TeamPage;
