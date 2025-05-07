"use client";

import { useEffect, useState } from "react";
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

type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: "online" | "offline";
};

export function Sidebar() {
  const { collapsed, toggleSidebar } = useSidebar();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        avatar: "/placeholder.svg",
        status: "online",
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        avatar: "/placeholder.svg",
        status: "online",
      },
      {
        id: "3",
        name: "Bob Johnson",
        email: "bob@example.com",
        avatar: "/placeholder.svg",
        status: "offline",
      },
      {
        id: "4",
        name: "Alice Brown",
        email: "alice@example.com",
        avatar: "/placeholder.svg",
        status: "online",
      },
      {
        id: "5",
        name: "Charlie Davis",
        email: "charlie@example.com",
        avatar: "/placeholder.svg",
        status: "offline",
      },
    ];
    setUsers(mockUsers);
  }, []);

  return (
    <aside
      className={cn(
        "rounded-3xl bg-[#BDE141] ml-2 mb-2 relative flex flex-col border-r transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-[#5E9C0A] px-4">
        {!collapsed && (
          <h2 className="text-lg text-[#5E9C0A] font-semibold whitespace-nowrap">
            Your Team
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
        <Link href="/">
          <Button
            variant="outline"
            size={collapsed ? "icon" : "default"}
            className={cn(
              "w-full justify-start",
              collapsed && "justify-center px-0"
            )}
          >
            <Package className={cn("h-5 w-5", !collapsed && "mr-2")} />
            {!collapsed && <span>Products</span>}
          </Button>
        </Link>
        <Link href="/products/new">
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start",
              collapsed && "justify-center px-0"
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
          <span className="font-medium whitespace-nowrap">Team Members</span>
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
                  <AvatarImage
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                  />
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
                    user.status === "online" ? "bg-green-500" : "bg-gray-400"
                  )}
                />
              </div>
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.status}
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
