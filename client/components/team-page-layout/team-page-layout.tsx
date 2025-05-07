import { PropsWithChildren } from "react";
import { SidebarProvider } from "./sidebar-provider";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";
import { Team } from "@/lib/entities";

const TeamPageLayout = ({
  children,
  team,
}: PropsWithChildren<{ team?: Team }>) => {
  if (!team) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen flex-col">
        <Navbar team={team} />
        <div className="mt-4 flex flex-1 overflow-hidden">
          <Sidebar team={team} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TeamPageLayout;
