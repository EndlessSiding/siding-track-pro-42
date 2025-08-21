
import { ReactNode, useEffect, useRef } from "react";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { MobileSidebar } from "./MobileSidebar";
import { MobileHeader } from "./MobileHeader";

interface MobileLayoutProps {
  children: ReactNode;
}

function MobileLayoutContent({ children }: MobileLayoutProps) {
  const { openMobile, setOpenMobile } = useSidebar();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMobile && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        // Check if click is on the trigger button
        const triggerButton = document.querySelector('[data-sidebar="trigger"]');
        if (triggerButton && triggerButton.contains(event.target as Node)) {
          return; // Don't close if clicking the trigger
        }
        setOpenMobile(false);
      }
    };

    if (openMobile) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [openMobile, setOpenMobile]);

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Mobile Sidebar Overlay */}
      {openMobile && (
        <div className="fixed inset-0 bg-black/50 z-40" />
      )}
      
      {/* Mobile Sidebar */}
      <div 
        ref={sidebarRef}
        className={`fixed left-0 top-0 h-full w-64 z-50 transform transition-transform duration-300 ease-in-out ${
          openMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <MobileSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <SidebarProvider>
      <MobileLayoutContent>{children}</MobileLayoutContent>
    </SidebarProvider>
  );
}
