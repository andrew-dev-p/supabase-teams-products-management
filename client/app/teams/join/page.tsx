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
import { ArrowLeft } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const joinTeamSchema = z.object({
  inviteCode: z
    .string()
    .regex(/^\d{6}$/, "Invite code must be a 6 digit number"),
});

type JoinTeamSchema = z.infer<typeof joinTeamSchema>;

const JoinTeamPage = () => {
  const router = useRouter();

  const form = useForm<JoinTeamSchema>({
    defaultValues: {
      inviteCode: "",
    },
    resolver: zodResolver(joinTeamSchema),
  });

  const onSubmit = async (data: JoinTeamSchema) => {
    console.log(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
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
            Enter the invitation code you received
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="inviteCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="invite-code">
                        Invitation Code
                      </FormLabel>
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
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
              <Button type="submit">Join Team</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default JoinTeamPage;
