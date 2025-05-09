"use client";

import { useQueryCurrentUser } from "@/hooks/use-query-current-user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { data: currentUser, isLoading } = useQueryCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser && !isLoading) {
      router.push("/login");
    }
  }, [currentUser, isLoading, router]);

  return children;
};

export default AuthGuard;
