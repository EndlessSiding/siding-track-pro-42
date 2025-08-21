
import { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { MobileHeader } from "./MobileHeader";
import { MobileSidebar } from "./MobileSidebar";
import { Outlet } from "react-router-dom";

interface MobileLayoutProps {
  children?: ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen w-full bg-background overflow-x-hidden">
        <MobileSidebar />
        <SidebarInset className="flex flex-1 flex-col min-w-0">
          <MobileHeader />
          <div className="flex-1 overflow-auto">
            <div className="h-full w-full px-2 py-4">
              {children || <Outlet />}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
