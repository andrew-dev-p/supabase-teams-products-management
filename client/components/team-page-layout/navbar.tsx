"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Team } from "@/lib/entities";
import { useMutateAuth } from "@/hooks/use-mutate-auth";

export function Navbar({ team }: { team?: Team }) {
  const { logoutMutation } = useMutateAuth();

  if (!team) {
    return null;
  }

  return (
    <header className="rounded-3xl sticky top-2 mx-2 z-10 flex h-16 items-center gap-4 border-b bg-[#BDE141] px-4 md:px-6">
      <Link href="/" className="flex items-center gap-2 font-semibold">
        <Image src="/logo.png" alt="Logo" width={32} height={32} />
        <span className="text-xl text-[#5E9C0A] font-bold mb-1">
          Let&apos;sCollab!
        </span>
      </Link>
      <div className="ml-auto flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2">
          <Badge
            variant="outline"
            className="text-xs text-[#5E9C0A] border-[#5E9C0A]"
          >
            Team &mdash; <span className="font-bold">{team.name}</span>
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>John Doe</DropdownMenuLabel>
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
              john.doe@example.com
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
