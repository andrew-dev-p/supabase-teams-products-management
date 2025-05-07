"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useMutateAuth } from "@/hooks/use-mutate-auth";
import { Loader, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage = () => {
  const supabase = createClient();
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);

  const form = useForm<ResetPasswordSchema>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(resetPasswordSchema),
  });

  const { resetPasswordMutation } = useMutateAuth();

  const onSubmit = (data: ResetPasswordSchema) => {
    resetPasswordMutation.mutate({ password: data.password });
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === "PASSWORD_RECOVERY") {
          setIsRecoveryMode(true);
        }
      }
    );

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setIsRecoveryMode(true);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  if (!isRecoveryMode) {
    return (
      <div className="p-4 text-center">
        <p>
          <Lock className="mr-2 h-4 w-4" /> Invalid or expired recovery session.
        </p>
      </div>
    );
  }

  return (
    <Card className="w-[400px]">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Reset Password</CardTitle>
        <CardDescription>Set a new password for your account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="password">New Password</FormLabel>
                      <FormControl>
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="confirmPassword">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="••••••"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={resetPasswordMutation.isPending}
              >
                {resetPasswordMutation.isPending ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
              <div className="text-center text-sm">
                <Link href="/login" className="underline underline-offset-4">
                  Back to Login
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ResetPasswordPage;
