import { Button } from "@/components/ui/button";
import { X } from "@phosphor-icons/react";

interface EffectsPanelProps {
  onClose: () => void;
}

export const EffectsPanel = ({ onClose }: EffectsPanelProps) => {
  return (
    <div className="bg-sidebar/95 sm:bg-sidebar border-sidebar-border pointer-events-auto absolute top-20 left-1/2 z-50 flex max-h-[70vh] w-[90vw] -translate-x-1/2 flex-col rounded-none border shadow-2xl backdrop-blur-md sm:relative sm:top-auto sm:left-auto sm:z-auto sm:m-2 sm:mt-3 sm:h-fit sm:max-h-full sm:w-90 sm:-translate-x-0 sm:-translate-y-0 sm:border-0 sm:border-r sm:shadow-xl">
      <div className="border-sidebar-border flex items-center justify-between border-b p-4">
        <h2 className="text-sidebar-foreground text-lg font-semibold tracking-tight">Effects</h2>
        <Button
          variant="secondary"
          size="icon"
          onClick={onClose}
          className="text-sidebar-foreground/70 h-auto w-auto rounded-none p-1"
        >
          <X size={20} className="h-auto! w-auto!" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-sidebar-foreground/70 text-sm">Effects configuration will go here.</p>
      </div>
    </div>
  );
};
