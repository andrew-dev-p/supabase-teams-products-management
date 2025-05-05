import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Users } from "lucide-react";

const TeamsPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="w-full h-full flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Join a Team
            </CardTitle>
            <CardDescription className="text-black">
              Join an existing team using an invitation code
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground">
              If you have received an invitation code from a team member, you
              can use it to join their team and start collaborating.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/teams/join" className="w-full">
              <Button className="w-full">Join with Code</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="w-full h-full flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Create a Team
            </CardTitle>
            <CardDescription className="text-black">
              Start a new team and invite members
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground">
              Create your own team, customize it, and invite team members to
              collaborate on products together.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/teams/create" className="w-full">
              <Button className="w-full" variant="outline">
                Create New Team
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default TeamsPage;
