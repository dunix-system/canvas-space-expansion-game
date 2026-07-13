import { useState } from "react";
import CanvasComponent from "./components/features/Canvas";
import { AppSidebar } from "./components/features/AppSidebar";
import { SidebarProvider } from "./components/ui/sidebar";
import { PropertiesPanel } from "./components/features/PropertiesPanel";
import { EffectsPanel } from "./components/features/EffectsPanel";
import { RandomizersPanel } from "./components/features/RandomizersPanel";

export type ActivePanel = "properties" | "effects" | "randomizers" | null;

function App() {
  const [circleRad, setCircleRad] = useState(42);
  const [circleGap, setCircleGap] = useState(24);
  const [angle, setAngle] = useState(30);

  const [glowEnabled, setGlowEnabled] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(15);
  const [glowStrength, setGlowStrength] = useState(1);
  const [trailEnabled, setTrailEnabled] = useState(false);
  const [inertiaEnabled, setInertiaEnabled] = useState(true);
  const [joinMovementEnabled, setJoinMovementEnabled] = useState(true);

  const [randomizePlacementEnabled, setRandomizePlacementEnabled] = useState(false);
  const [placementRandomness, setPlacementRandomness] = useState(5);
  const [randomizeSizeEnabled, setRandomizeSizeEnabled] = useState(false);
  const [sizeRandomness, setSizeRandomness] = useState(5);

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
          trailEnabled={trailEnabled}
          inertiaEnabled={inertiaEnabled}
          joinMovementEnabled={joinMovementEnabled}
          randomizePlacementEnabled={randomizePlacementEnabled}
          placementRandomness={placementRandomness}
          randomizeSizeEnabled={randomizeSizeEnabled}
          sizeRandomness={sizeRandomness}
        />
      </div>

      <SidebarProvider defaultOpen={false} className="pointer-events-none absolute inset-0 z-10 flex w-full">
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
              trailEnabled={trailEnabled}
              setTrailEnabled={setTrailEnabled}
              inertiaEnabled={inertiaEnabled}
              setInertiaEnabled={setInertiaEnabled}
              joinMovementEnabled={joinMovementEnabled}
              setJoinMovementEnabled={setJoinMovementEnabled}
              onClose={() => setActivePanel(null)}
            />
          )}

          {activePanel === "randomizers" && (
            <RandomizersPanel
              randomizePlacementEnabled={randomizePlacementEnabled}
              setRandomizePlacementEnabled={setRandomizePlacementEnabled}
              placementRandomness={placementRandomness}
              setPlacementRandomness={setPlacementRandomness}
              randomizeSizeEnabled={randomizeSizeEnabled}
              setRandomizeSizeEnabled={setRandomizeSizeEnabled}
              sizeRandomness={sizeRandomness}
              setSizeRandomness={setSizeRandomness}
              onClose={() => setActivePanel(null)}
            />
          )}
        </div>
      </SidebarProvider>
    </div>
  );
}

export default App;
