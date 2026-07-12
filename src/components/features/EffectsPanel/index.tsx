import { Button } from "@/components/ui/button";
import { X } from "@phosphor-icons/react";

interface EffectsPanelProps {
  onClose: () => void;
}

export const EffectsPanel = ({ onClose }: EffectsPanelProps) => {
  return (
    <div className="bg-sidebar border-sidebar-border pointer-events-auto flex h-fit max-h-full w-80 flex-col border-r shadow-xl">
      <div className="border-sidebar-border flex items-center justify-between border-b p-4">
        <h2 className="text-sidebar-foreground text-lg font-semibold tracking-tight">Effects</h2>
        <Button variant="secondary" size="icon-sm" onClick={onClose} className="text-sidebar-foreground/70">
          <X size={32} />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-sidebar-foreground/70 text-sm">Effects configuration will go here.</p>
      </div>
    </div>
  );
};
