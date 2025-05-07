import { PropsWithChildren } from "react";
import { SidebarProvider } from "./sidebar-provider";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";

const TeamPageLayout = ({ children }: PropsWithChildren) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen flex-col">
        <Navbar />
        <div className="mt-4 flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TeamPageLayout;
