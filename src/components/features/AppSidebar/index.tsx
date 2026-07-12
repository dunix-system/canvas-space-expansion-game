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
    <Sidebar collapsible="icon" className="border-sidebar-border pointer-events-auto border-r shadow-sm">
      <SidebarHeader className="flex h-12 flex-row items-center justify-between p-0">
        {state === "collapsed" ? (
          <div
            className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mx-auto flex h-12 w-full cursor-pointer items-center justify-center rounded-none transition-colors"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={toggleSidebar}
            title="Expand Sidebar"
          >
            {isHovered ? <SidebarSimple size={24} /> : <PlanetIcon size={28} className="text-primary" />}
          </div>
        ) : (
          <div className="flex h-12 w-full items-center justify-between overflow-hidden pl-3">
            <div className="flex items-center gap-2">
              <PlanetIcon size={28} className="text-primary shrink-0" />
              <span className="truncate text-lg font-semibold tracking-tight">spaceexp</span>
            </div>
            <SidebarTrigger className="h-12 w-12 shrink-0 rounded-none" />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={activePanel === "properties"}
              onClick={() => setActivePanel(activePanel === "properties" ? null : "properties")}
              tooltip="Properties"
              size="lg"
              className="!text-sm group-data-[collapsible=icon]:!h-12 group-data-[collapsible=icon]:!w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:!p-0 [&>svg]:!size-6"
            >
              <SlidersHorizontal />
              <span className="group-data-[collapsible=icon]:hidden">Properties</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={activePanel === "effects"}
              onClick={() => setActivePanel(activePanel === "effects" ? null : "effects")}
              tooltip="Effects"
              size="lg"
              className="!text-sm group-data-[collapsible=icon]:!h-12 group-data-[collapsible=icon]:!w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:!p-0 [&>svg]:!size-6"
            >
              <Sparkle />
              <span className="group-data-[collapsible=icon]:hidden">Effects</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};
