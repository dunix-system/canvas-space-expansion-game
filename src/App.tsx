import { useState } from "react";
import CanvasComponent from "./components/features/Canvas";
import { AppSidebar } from "./components/features/AppSidebar";
import { SidebarProvider } from "./components/ui/sidebar";
import { PropertiesPanel } from "./components/features/PropertiesPanel";
import { EffectsPanel } from "./components/features/EffectsPanel";

export type ActivePanel = "properties" | "effects" | null;

function App() {
  const [circleRad, setCircleRad] = useState(40);
  const [circleGap, setCircleGap] = useState(30);
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);

  return (
    <div className="bg-background relative h-screen w-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <CanvasComponent circleRad={circleRad} circleGap={circleGap} />
      </div>

      <SidebarProvider className="pointer-events-none absolute inset-0 z-10 flex w-full">
        <div className="pointer-events-auto flex h-full">
          <AppSidebar activePanel={activePanel} setActivePanel={setActivePanel} />

          {activePanel === "properties" && (
            <PropertiesPanel
              circleRad={circleRad}
              setCircleRad={setCircleRad}
              circleGap={circleGap}
              setCircleGap={setCircleGap}
              onClose={() => setActivePanel(null)}
            />
          )}

          {activePanel === "effects" && <EffectsPanel onClose={() => setActivePanel(null)} />}
        </div>
      </SidebarProvider>
    </div>
  );
}

export default App;
