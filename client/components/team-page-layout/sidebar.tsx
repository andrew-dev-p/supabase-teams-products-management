"use client";

import Link from "next/link";
import {
  Package,
  Plus,
  SidebarCloseIcon,
  SidebarOpenIcon,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-provider";
import { Team } from "@/lib/entities";
import { useQueryTeamUsers } from "@/hooks/use-query-team-users";
import { usePathname } from "next/navigation";
import { usePresence } from "@/hooks/use-presence";
import { useQueryCurrentUser } from "@/hooks/use-query-current-user";

export function Sidebar({ team }: { team?: Team }) {
  const pathname = usePathname();

  const { collapsed, toggleSidebar } = useSidebar();

  const { data: users } = useQueryTeamUsers(team?.id as string);

  const { data: currentUser } = useQueryCurrentUser();

  usePresence(team?.id as string, currentUser);

  if (!users || !team || !currentUser) {
    return null;
  }

  return (
    <aside
      className={cn(
        "rounded-3xl bg-[#BDE141] ml-2 mb-2 relative flex flex-col border-r transition-all duration-300 border-b-4 border-primary",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-[#5E9C0A] px-4">
        {!collapsed && (
          <h2 className="text-lg text-[#5E9C0A] font-semibold whitespace-nowrap">
            {team.name}
          </h2>
        )}
        <Button
          variant="outline"
          size="icon"
          className="ml-auto h-8 w-8"
          onClick={toggleSidebar}
        >
          {collapsed ? (
            <SidebarOpenIcon className="h-4 w-4" />
          ) : (
            <SidebarCloseIcon className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>
      <div className="flex flex-col gap-2 p-4">
        <Link href={`/teams/${team.slug}/products`}>
          <Button
            variant="outline"
            size={collapsed ? "icon" : "default"}
            className={cn(
              "w-full justify-start",
              collapsed && "justify-center px-0",
              !pathname.includes("create") && "border-b-4 border-black"
            )}
          >
            <Package className={cn("h-5 w-5", !collapsed && "mr-2")} />
            {!collapsed && <span>Products</span>}
          </Button>
        </Link>
        <Link href={`/teams/${team.slug}/products/create`}>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start",
              collapsed && "justify-center px-0",
              pathname.includes("create") && "border-b-4 border-black"
            )}
          >
            <Plus className={cn("h-5 w-5", !collapsed && "mr-2")} />
            {!collapsed && <span>New Product</span>}
          </Button>
        </Link>
      </div>
      <Separator className="bg-[#5E9C0A]" />
      <div
        className={cn(
          "flex flex-nowrap text-[#5E9C0A] items-center p-4",
          collapsed && "justify-center"
        )}
      >
        <Users className={cn("h-5 w-5", !collapsed && "mr-2")} />
        {!collapsed && (
          <span className="font-medium whitespace-nowrap">
            Team Members ({users.length})
          </span>
        )}
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 px-4">
          {users.map((user) => (
            <div
              key={user.id}
              className={cn(
                "flex items-center gap-3 rounded-md",
                collapsed ? "justify-center" : "justify-start"
              )}
            >
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.profile_picture} alt={user.name} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span
                  className={cn(
                    "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background",
                    user.is_online ? "bg-green-500" : "bg-gray-400"
                  )}
                />
              </div>
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.is_online ? "online" : "offline"}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
