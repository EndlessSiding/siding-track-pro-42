
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Header } from "./Header";
import { MobileLayout } from "./MobileLayout";
import { Outlet } from "react-router-dom";
import { useMobileDetection } from "@/hooks/use-mobile-detection";

export function Layout() {
  const { isMobile } = useMobileDetection();

  if (isMobile) {
    return (
      <MobileLayout>
        <Outlet />
      </MobileLayout>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex flex-1 flex-col">
          <Header />
          <div className="flex-1 overflow-auto">
            <div className="h-full w-full">
              <Outlet />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
