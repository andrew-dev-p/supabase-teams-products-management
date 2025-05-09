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
import { useQueryCurrentUser } from "@/hooks/use-query-current-user";
import { DoorOpen, User } from "lucide-react";
import EditUserDialog from "./edit-user-dialog";
import { useState } from "react";

export function Navbar({ team }: { team?: Team }) {
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);

  const { logoutMutation } = useMutateAuth();

  const { data: currentUser } = useQueryCurrentUser();

  if (!team) {
    return null;
  }

  return (
    <>
      <EditUserDialog
        isOpen={isEditUserDialogOpen}
        onClose={() => setIsEditUserDialogOpen(false)}
      />
      <header className="rounded-3xl sticky top-2 mx-2 z-10 flex h-16 items-center gap-4 border-b-4 border-primary bg-[#BDE141] px-4 md:px-6">
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
                  <AvatarImage src={currentUser?.profile_picture} alt="User" />
                  <AvatarFallback>
                    {currentUser?.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="py-1">
                {currentUser?.name}
              </DropdownMenuLabel>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground py-1">
                {currentUser?.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsEditUserDialogOpen(true)}>
                <User className="mr-2 h-4 w-4" /> Edit profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
                <DoorOpen className="mr-2 h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
}
