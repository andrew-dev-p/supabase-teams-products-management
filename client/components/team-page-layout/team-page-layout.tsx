import { PropsWithChildren } from "react";
import { SidebarProvider } from "./sidebar-provider";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";
import { Team } from "@/lib/entities";

const TeamPageLayout = ({
  children,
  team,
}: PropsWithChildren<{ team?: Team }>) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen flex-col">
        <Navbar team={team} />
        <div className="mt-4 flex flex-1 overflow-hidden">
          <Sidebar team={team} />
          <main className="bg-[#BDE141] flex-1 overflow-y-auto rounded-3xl mx-2 mb-2.5 p-2 md:p-4">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TeamPageLayout;
