import { useState } from "react";
import CanvasComponent from "./components/features/Canvas";
import { ControlPanel } from "./components/features/ControlPanel";
import { AppSidebar } from "./components/features/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";

function App() {
  const [circleRad, setCircleRad] = useState(40);
  const [circleGap, setCircleGap] = useState(30);

  return (
    <>
      <SidebarProvider className="pointer-events-none absolute top-0 right-0 bottom-0 left-0">
        <AppSidebar />
        {/* <ControlPanel
        circleRad={circleRad}
        setCircleRad={setCircleRad}
        circleGap={circleGap}
        setCircleGap={setCircleGap}
      /> */}
        <SidebarTrigger className="pointer-events-auto" />
      </SidebarProvider>
      <CanvasComponent circleRad={circleRad} circleGap={circleGap} />
    </>
  );
}

export default App;
