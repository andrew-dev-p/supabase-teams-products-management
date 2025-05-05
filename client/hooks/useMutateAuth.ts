import { createClient } from "@/lib/supabase/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useMutateAuth = () => {
  const supabase = createClient();
  const router = useRouter();

  const signUp = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/teams`,
        },
      });

      toast.success("Check your email for the confirmation link!");
      router.push("/verify");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  const signUpMutation = useMutation({
    mutationFn: signUp,
  });

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Login successful!");
      router.push("/teams");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  const loginMutation = useMutation({
    mutationFn: login,
  });

  return {
    signUpMutation,
    loginMutation,
  };
};
