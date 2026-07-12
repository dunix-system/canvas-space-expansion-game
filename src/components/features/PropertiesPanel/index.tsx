import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { X } from "@phosphor-icons/react";
import type { Dispatch, SetStateAction } from "react";

interface PropertiesPanelProps {
  circleRad: number;
  setCircleRad: Dispatch<SetStateAction<number>>;
  circleGap: number;
  setCircleGap: Dispatch<SetStateAction<number>>;
  onClose: () => void;
}

export const PropertiesPanel = ({
  circleRad,
  setCircleRad,
  circleGap,
  setCircleGap,
  onClose,
}: PropertiesPanelProps) => {
  return (
    <div className="bg-sidebar border-sidebar-border pointer-events-auto m-2 mt-3 flex h-fit max-h-full w-90 flex-col border-r shadow-xl">
      <div className="border-sidebar-border flex items-center justify-between border-b p-4">
        <h2 className="text-sidebar-foreground text-lg font-semibold tracking-tight">Properties</h2>
        <Button variant="secondary" size="icon-sm" onClick={onClose} className="text-sidebar-foreground/70">
          <X size={20} />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 pb-8">
        <FieldGroup className="gap-8">
          <Field className="gap-8">
            <div className="flex items-baseline justify-between gap-8">
              <FieldLabel htmlFor="circleRad">Radius of the disc</FieldLabel>
              <Input
                type="number"
                id="circleRad"
                value={circleRad}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setCircleRad(Number(event?.target?.value));
                }}
                className="h-auto w-32 [appearance:textfield] border-transparent bg-transparent! pr-3 pl-3 text-right text-4xl! font-bold tracking-tighter shadow-none focus-visible:border-transparent focus-visible:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
            <Slider
              value={[circleRad]}
              max={800}
              min={1}
              step={1}
              onValueChange={(val) => setCircleRad(val[0])}
            />
          </Field>
          <Field className="gap-4">
            <div className="flex items-baseline justify-between gap-8">
              <FieldLabel htmlFor="circleGap">Gap between discs</FieldLabel>
              <Input
                type="number"
                id="circleGap"
                value={circleGap}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setCircleGap(Number(event?.target?.value));
                }}
                className="h-auto w-32 [appearance:textfield] border-transparent bg-transparent! pr-3 pl-3 text-right text-4xl! font-bold tracking-tighter shadow-none focus-visible:border-transparent focus-visible:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
            <div className="relative">
              <div className="bg-muted pointer-events-none absolute top-1/2 left-1/2 h-[20px] w-[4px] -translate-x-1/2 -translate-y-1/2" />

              <Slider
                value={[circleGap]}
                max={800}
                min={-800}
                step={1}
                onValueChange={(val) => setCircleGap(val[0])}
              />
            </div>
          </Field>
        </FieldGroup>
      </div>
    </div>
  );
};
