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
import {
  PlanetIcon,
  SlidersHorizontal,
  Sparkle,
  SidebarSimple,
  CaretRight,
  CaretLeft,
} from "@phosphor-icons/react";

interface AppSidebarProps {
  activePanel: "properties" | "effects" | null;
  setActivePanel: React.Dispatch<React.SetStateAction<"properties" | "effects" | null>>;
}

export const AppSidebar = ({ activePanel, setActivePanel }: AppSidebarProps) => {
  const { state, toggleSidebar, isMobile } = useSidebar();
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  if (isMobile) {
    return (
      <div className="bg-sidebar border-sidebar-border pointer-events-auto absolute top-0 right-0 left-0 z-40 flex h-14 items-center justify-between border-b px-3 shadow-sm sm:px-2">
        <div className="no-scrollbar flex h-full w-full items-center gap-0 overflow-x-auto">
          <div
            className={`flex h-full items-center transition-all duration-300 ease-in-out ${isMobileExpanded ? "gap-1" : "gap-0"} mr-1 shrink-0 px-1`}
          >
            <PlanetIcon size={32} className="text-primary shrink-0" />
            <span
              className={`overflow-hidden text-lg font-semibold tracking-tight whitespace-nowrap transition-all duration-300 ease-in-out ${isMobileExpanded ? "max-w-[120px] opacity-100" : "max-w-0 opacity-0"}`}
            >
              spaceexp
            </span>
          </div>

          <button
            onClick={() => setActivePanel(activePanel === "properties" ? null : "properties")}
            className={`flex h-full items-center transition-all duration-300 ease-in-out ${isMobileExpanded ? "gap-1" : "gap-0"} shrink-0 rounded-none border-none px-3 ${activePanel === "properties" ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground hover:bg-sidebar-accent/50"}`}
          >
            <SlidersHorizontal size={28} className="shrink-0" />
            <span
              className={`overflow-hidden text-sm font-medium whitespace-nowrap transition-all duration-300 ease-in-out ${isMobileExpanded ? "max-w-[100px] opacity-100" : "max-w-0 opacity-0"}`}
            >
              Properties
            </span>
          </button>

          <button
            onClick={() => setActivePanel(activePanel === "effects" ? null : "effects")}
            className={`flex h-full items-center transition-all duration-300 ease-in-out ${isMobileExpanded ? "gap-1" : "gap-0"} shrink-0 rounded-none border-none px-3 ${activePanel === "effects" ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground hover:bg-sidebar-accent/50"}`}
          >
            <Sparkle size={28} className="shrink-0" />
            <span
              className={`overflow-hidden text-sm font-medium whitespace-nowrap transition-all duration-300 ease-in-out ${isMobileExpanded ? "max-w-[100px] opacity-100" : "max-w-0 opacity-0"}`}
            >
              Effects
            </span>
          </button>
        </div>

        <button
          onClick={() => setIsMobileExpanded(!isMobileExpanded)}
          className="bg-sidebar-accent hover:bg-sidebar-accent/80 text-sidebar-foreground ml-0 shrink-0 rounded-none p-1 transition-colors"
        >
          {isMobileExpanded ? <CaretLeft size={20} /> : <CaretRight size={20} />}
        </button>
      </div>
    );
  }

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
