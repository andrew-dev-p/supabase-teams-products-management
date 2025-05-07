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
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { ArrowLeft, Loader } from "lucide-react";
import { useMutateTeams } from "@/hooks/useMutateTeams";

const createTeamSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  slug: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[a-z0-9-]+$/.test(val),
      "Team URL can only contain lowercase letters, numbers, and hyphens"
    ),
});

type CreateTeamSchema = z.infer<typeof createTeamSchema>;

export default function CreateTeam() {
  const router = useRouter();

  const form = useForm<CreateTeamSchema>({
    defaultValues: {
      name: "",
      slug: "",
    },
    resolver: zodResolver(createTeamSchema),
  });

  const { createTeamMutation } = useMutateTeams();

  const onSubmit = async (data: CreateTeamSchema) => {
    createTeamMutation.mutate({
      name: data.name,
      slug: data.slug || "",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="outline" size="icon" className="h-8 w-8 group">
                <ArrowLeft className="h-4 w-4 group-hover:rotate-360 transition" />
              </Button>
            </Link>
            <CardTitle>Create a Team</CardTitle>
          </div>
          <CardDescription>Set up your new team</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="name">Team Name</FormLabel>
                      <FormControl>
                        <Input
                          id="name"
                          placeholder="Enter your team name"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="slug">Team URL (optional)</FormLabel>
                      <div className="flex items-center">
                        <span className="text-sm text-muted-foreground mr-2">
                          {process.env.NEXT_PUBLIC_APP_URL}/teams/
                        </span>
                        <FormControl>
                          <Input
                            id="slug"
                            placeholder="team-url"
                            {...field}
                            className="flex-1"
                          />
                        </FormControl>
                      </div>

                      <FormMessage />
                      <p className="text-xs text-muted-foreground mt-1">
                        This will be used in your team URL and cannot be changed
                        later. Leave it empty to generate a random URL.
                      </p>
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
              <Button type="submit" disabled={createTeamMutation.isPending}>
                {createTeamMutation.isPending ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Team"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
