import { createClient } from "@/lib/supabase/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const supabase = createClient();

const signUp = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/teams`,
    },
  });
};

export const useMutateAuth = () => {
  const router = useRouter();

  const signUpMutation = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      toast.success("Check your email for the confirmation link!");
      router.push("/verify");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    },
  });

  return {
    signUpMutation,
  };
};
