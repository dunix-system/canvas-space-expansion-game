import { useState } from "react";
import CanvasComponent from "./components/features/Canvas";
import { AppSidebar } from "./components/features/AppSidebar";
import { SidebarProvider } from "./components/ui/sidebar";
import { PropertiesPanel } from "./components/features/PropertiesPanel";
import { EffectsPanel } from "./components/features/EffectsPanel";

export type ActivePanel = "properties" | "effects" | null;

function App() {
  const [circleRad, setCircleRad] = useState(40);
  const [circleGap, setCircleGap] = useState(0);
  const [angle, setAngle] = useState(0);
  
  const [glowEnabled, setGlowEnabled] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(15);
  const [glowStrength, setGlowStrength] = useState(1);
  
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);

  return (
    <div className="bg-background relative h-screen w-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <CanvasComponent 
          circleRad={circleRad} 
          circleGap={circleGap} 
          angle={angle} 
          glowEnabled={glowEnabled}
          glowIntensity={glowIntensity}
          glowStrength={glowStrength}
        />
      </div>

      <SidebarProvider className="pointer-events-none absolute inset-0 z-10 flex w-full">
        <div className="pointer-events-none relative flex h-full w-full">
          <AppSidebar activePanel={activePanel} setActivePanel={setActivePanel} />

          {activePanel === "properties" && (
            <PropertiesPanel
              circleRad={circleRad}
              setCircleRad={setCircleRad}
              circleGap={circleGap}
              setCircleGap={setCircleGap}
              angle={angle}
              setAngle={setAngle}
              onClose={() => setActivePanel(null)}
            />
          )}

          {activePanel === "effects" && (
            <EffectsPanel 
              glowEnabled={glowEnabled}
              setGlowEnabled={setGlowEnabled}
              glowIntensity={glowIntensity}
              setGlowIntensity={setGlowIntensity}
              glowStrength={glowStrength}
              setGlowStrength={setGlowStrength}
              onClose={() => setActivePanel(null)} 
            />
          )}
        </div>
      </SidebarProvider>
    </div>
  );
}

export default App;
