import { X } from "@phosphor-icons/react";

interface EffectsPanelProps {
  onClose: () => void;
}

export const EffectsPanel = ({ onClose }: EffectsPanelProps) => {
  return (
    <div className="h-full w-80 bg-sidebar border-r border-sidebar-border shadow-xl flex flex-col pointer-events-auto">
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <h2 className="font-semibold text-lg text-sidebar-foreground tracking-tight">Effects</h2>
        <button 
          onClick={onClose}
          className="p-1 rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      <div className="p-4 flex-1 overflow-y-auto">
        <p className="text-sm text-sidebar-foreground/70">Effects configuration will go here.</p>
      </div>
    </div>
  );
};
