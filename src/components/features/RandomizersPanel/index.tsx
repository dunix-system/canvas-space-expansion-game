import { Button } from "@/components/ui/button";
import { X } from "@phosphor-icons/react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import type { Dispatch, SetStateAction } from "react";

interface RandomizersPanelProps {
  randomizePlacementEnabled: boolean;
  setRandomizePlacementEnabled: Dispatch<SetStateAction<boolean>>;
  placementRandomness: number;
  setPlacementRandomness: Dispatch<SetStateAction<number>>;
  randomizeSizeEnabled: boolean;
  setRandomizeSizeEnabled: Dispatch<SetStateAction<boolean>>;
  sizeRandomness: number;
  setSizeRandomness: Dispatch<SetStateAction<number>>;
  onClose: () => void;
}

export const RandomizersPanel = ({
  randomizePlacementEnabled,
  setRandomizePlacementEnabled,
  placementRandomness,
  setPlacementRandomness,
  randomizeSizeEnabled,
  setRandomizeSizeEnabled,
  sizeRandomness,
  setSizeRandomness,
  onClose,
}: RandomizersPanelProps) => {
  return (
    <div className="bg-sidebar/95 sm:bg-sidebar border-sidebar-border pointer-events-auto absolute top-20 left-1/2 z-50 flex max-h-[70vh] w-[90vw] -translate-x-1/2 flex-col rounded-none border shadow-2xl backdrop-blur-md sm:relative sm:top-auto sm:left-auto sm:z-auto sm:m-2 sm:mt-2 sm:h-fit sm:max-h-full sm:w-90 sm:-translate-x-0 sm:-translate-y-0 sm:border-0 sm:border-r sm:shadow-xl">
      <div className="border-sidebar-border flex items-center justify-between border-b p-4">
        <h2 className="text-sidebar-foreground text-lg font-semibold tracking-tight">Randomizers</h2>
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
                id="randomizePlacementEnabled"
                checked={randomizePlacementEnabled}
                onCheckedChange={(checked) => setRandomizePlacementEnabled(!!checked)}
              />
              <FieldLabel htmlFor="randomizePlacementEnabled" className="cursor-pointer text-base">
                Randomize Disk Placement
              </FieldLabel>
            </div>
            {randomizePlacementEnabled && (
              <div className="border-border/50 mt-2 flex flex-col gap-4 border-l-2 pl-6">
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="placementRandomness" className="text-sm">
                    Placement Randomness Variance
                  </FieldLabel>
                  <span className="text-muted-foreground text-sm font-medium">{placementRandomness}</span>
                </div>
                <Slider
                  id="placementRandomness"
                  value={[placementRandomness]}
                  min={1}
                  max={50}
                  step={1}
                  onValueChange={(val) => setPlacementRandomness(val[0])}
                />
              </div>
            )}
          </Field>
          <Field className="gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="randomizeSizeEnabled"
                checked={randomizeSizeEnabled}
                onCheckedChange={(checked) => setRandomizeSizeEnabled(!!checked)}
              />
              <FieldLabel htmlFor="randomizeSizeEnabled" className="cursor-pointer text-base">
                Randomize Disk Size
              </FieldLabel>
            </div>
            {randomizeSizeEnabled && (
              <div className="border-border/50 mt-2 flex flex-col gap-4 border-l-2 pl-6">
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="sizeRandomness" className="text-sm">
                    Size Randomness Variance
                  </FieldLabel>
                  <span className="text-muted-foreground text-sm font-medium">{sizeRandomness}</span>
                </div>
                <Slider
                  id="sizeRandomness"
                  value={[sizeRandomness]}
                  min={1}
                  max={50}
                  step={1}
                  onValueChange={(val) => setSizeRandomness(val[0])}
                />
              </div>
            )}
          </Field>
        </FieldGroup>
      </div>
    </div>
  );
};
