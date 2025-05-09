"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { ArrowLeft, Loader } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useMutateTeams } from "@/hooks/use-mutate-teams";
import TeamGuard from "@/guards/team-guard";
import AuthGuard from "@/guards/auth-guard";

const joinTeamSchema = z.object({
  slug: z
    .string()
    .min(1, "Team URL is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Team URL can only contain lowercase letters, numbers, and hyphens"
    ),
});

type JoinTeamSchema = z.infer<typeof joinTeamSchema>;

const JoinTeamPage = () => {
  const router = useRouter();

  const { joinTeamMutation } = useMutateTeams();

  const form = useForm<JoinTeamSchema>({
    defaultValues: {
      slug: "",
    },
    resolver: zodResolver(joinTeamSchema),
  });

  const onSubmit = async (data: JoinTeamSchema) => {
    joinTeamMutation.mutate({
      slug: data.slug,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Link href="/teams">
              <Button variant="outline" size="icon" className="h-8 w-8 group">
                <ArrowLeft className="h-4 w-4 group-hover:rotate-360 transition" />
              </Button>
            </Link>
            <CardTitle>Join a Team</CardTitle>
          </div>
          <CardDescription>
            Enter the team slug you want to join
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team slug</FormLabel>
                      <FormControl>
                        <Input placeholder="my-team-slug" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between mt-6">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push("/teams")}
              >
                Cancel
              </Button>
              <Button disabled={joinTeamMutation.isPending} type="submit">
                {joinTeamMutation.isPending ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Joining...
                  </>
                ) : (
                  "Join Team"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

const GuardedJoinTeamPage = () => {
  return (
    <AuthGuard>
      <TeamGuard>
        <JoinTeamPage />
      </TeamGuard>
    </AuthGuard>
  );
};

export default GuardedJoinTeamPage;
