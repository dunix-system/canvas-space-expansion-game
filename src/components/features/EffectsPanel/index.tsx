import { Button } from "@/components/ui/button";
import { X } from "@phosphor-icons/react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import type { Dispatch, SetStateAction } from "react";

interface EffectsPanelProps {
  glowEnabled: boolean;
  setGlowEnabled: Dispatch<SetStateAction<boolean>>;
  glowIntensity: number;
  setGlowIntensity: Dispatch<SetStateAction<number>>;
  glowStrength: number;
  setGlowStrength: Dispatch<SetStateAction<number>>;
  trailEnabled: boolean;
  setTrailEnabled: Dispatch<SetStateAction<boolean>>;
  inertiaEnabled: boolean;
  setInertiaEnabled: Dispatch<SetStateAction<boolean>>;
  onClose: () => void;
}

export const EffectsPanel = ({ 
  glowEnabled, 
  setGlowEnabled, 
  glowIntensity, 
  setGlowIntensity, 
  glowStrength,
  setGlowStrength,
  trailEnabled,
  setTrailEnabled,
  inertiaEnabled,
  setInertiaEnabled,
  onClose 
}: EffectsPanelProps) => {
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
      <div className="flex-1 overflow-y-auto p-4 pb-8">
        <FieldGroup className="gap-8">
          <Field className="gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="glowEnabled" 
                checked={glowEnabled} 
                onCheckedChange={(checked) => setGlowEnabled(!!checked)} 
              />
              <FieldLabel htmlFor="glowEnabled" className="cursor-pointer text-base">Enable Glow Effect</FieldLabel>
            </div>
            {glowEnabled && (
              <div className="mt-2 flex flex-col gap-4 pl-6 border-l-2 border-border/50">
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="glowIntensity" className="text-sm">Glow Intensity</FieldLabel>
                  <span className="text-muted-foreground text-sm font-medium">{glowIntensity}</span>
                </div>
                <Slider
                  id="glowIntensity"
                  value={[glowIntensity]}
                  min={1}
                  max={500}
                  step={1}
                  onValueChange={(val) => setGlowIntensity(val[0])}
                />
                <div className="flex items-center justify-between mt-4">
                  <FieldLabel htmlFor="glowStrength" className="text-sm">Glow Strength</FieldLabel>
                  <span className="text-muted-foreground text-sm font-medium">{glowStrength}</span>
                </div>
                <Slider
                  id="glowStrength"
                  value={[glowStrength]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(val) => setGlowStrength(val[0])}
                />
              </div>
            )}
          </Field>
          <Field className="gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="trailEnabled" 
                checked={trailEnabled} 
                onCheckedChange={(checked) => setTrailEnabled(!!checked)} 
              />
              <FieldLabel htmlFor="trailEnabled" className="cursor-pointer text-base">Enable Motion Blur (Trail)</FieldLabel>
            </div>
          </Field>
          <Field className="gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="inertiaEnabled" 
                checked={inertiaEnabled} 
                onCheckedChange={(checked) => setInertiaEnabled(!!checked)} 
              />
              <FieldLabel htmlFor="inertiaEnabled" className="cursor-pointer text-base">Enable Smooth Stop</FieldLabel>
            </div>
          </Field>
        </FieldGroup>
      </div>
    </div>
  );
};
