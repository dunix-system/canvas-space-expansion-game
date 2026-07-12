import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { PlanetIcon, SlidersHorizontal, Sparkle, SidebarSimple } from "@phosphor-icons/react";

interface AppSidebarProps {
  activePanel: "properties" | "effects" | null;
  setActivePanel: React.Dispatch<React.SetStateAction<"properties" | "effects" | null>>;
}

export const AppSidebar = ({ activePanel, setActivePanel }: AppSidebarProps) => {
  const { state, toggleSidebar } = useSidebar();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Sidebar collapsible="icon" className="pointer-events-auto border-r border-sidebar-border shadow-sm">
      <SidebarHeader className="flex h-14 flex-row items-center justify-between px-2 py-2">
        {state === "collapsed" ? (
          <div 
            className="flex h-8 w-8 items-center justify-center cursor-pointer rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors mx-auto"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={toggleSidebar}
            title="Expand Sidebar"
          >
            {isHovered ? <SidebarSimple size={20} /> : <PlanetIcon size={20} className="text-primary" />}
          </div>
        ) : (
          <div className="flex w-full items-center justify-between overflow-hidden">
            <div className="flex items-center gap-2 px-1">
              <PlanetIcon size={24} className="text-primary shrink-0" />
              <span className="font-semibold text-lg tracking-tight truncate">spaceexp</span>
            </div>
            <SidebarTrigger className="shrink-0" />
          </div>
        )}
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu className="mt-4 gap-2 px-2">
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={activePanel === 'properties'} 
              onClick={() => setActivePanel(activePanel === 'properties' ? null : 'properties')}
              tooltip="Properties"
              size="lg"
            >
              <SlidersHorizontal size={20} />
              <span>Properties</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={activePanel === 'effects'} 
              onClick={() => setActivePanel(activePanel === 'effects' ? null : 'effects')}
              tooltip="Effects"
              size="lg"
            >
              <Sparkle size={20} />
              <span>Effects</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};
