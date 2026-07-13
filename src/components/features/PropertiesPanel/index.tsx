import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { ScrubbableInput } from "@/components/ui/scrubbable-input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Knob } from "@/components/ui/knob";
import { X } from "@phosphor-icons/react";
import type { Dispatch, SetStateAction } from "react";

interface PropertiesPanelProps {
  circleRad: number;
  setCircleRad: Dispatch<SetStateAction<number>>;
  circleGap: number;
  setCircleGap: Dispatch<SetStateAction<number>>;
  angle: number;
  setAngle: Dispatch<SetStateAction<number>>;
  onClose: () => void;
}

export const PropertiesPanel = ({
  circleRad,
  setCircleRad,
  circleGap,
  setCircleGap,
  angle,
  setAngle,
  onClose,
}: PropertiesPanelProps) => {
  return (
    <div className="bg-sidebar/95 sm:bg-sidebar border-sidebar-border pointer-events-auto absolute top-20 left-1/2 z-50 flex max-h-[70vh] w-[90vw] -translate-x-1/2 flex-col rounded-none border shadow-2xl backdrop-blur-md sm:relative sm:top-auto sm:left-auto sm:z-auto sm:m-2 sm:mt-3 sm:h-fit sm:max-h-full sm:w-90 sm:-translate-x-0 sm:-translate-y-0 sm:border-0 sm:border-r sm:shadow-xl">
      <div className="border-sidebar-border flex items-center justify-between border-b p-4">
        <h2 className="text-sidebar-foreground text-lg font-semibold tracking-tight">Properties</h2>
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
          <Field className="gap-8">
            <div className="flex items-baseline justify-between gap-8">
              <FieldLabel htmlFor="circleRad">Radius of the disc</FieldLabel>
              <ScrubbableInput
                id="circleRad"
                value={circleRad}
                onValueChange={setCircleRad}
                min={1}
                max={800}
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
              <ScrubbableInput
                id="circleGap"
                value={circleGap}
                onValueChange={setCircleGap}
                min={-50}
                max={50}
                className="h-auto w-32 [appearance:textfield] border-transparent bg-transparent! pr-3 pl-3 text-right text-4xl! font-bold tracking-tighter shadow-none focus-visible:border-transparent focus-visible:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
            <div className="relative">
              <div className="bg-muted pointer-events-none absolute top-1/2 left-1/2 h-[20px] w-[4px] -translate-x-1/2 -translate-y-1/2" />

              <Slider
                value={[circleGap]}
                max={50}
                min={-50}
                step={1}
                onValueChange={(val) => setCircleGap(val[0])}
              />
            </div>
          </Field>
          <Field className="gap-2 flex flex-col items-center">
            <div className="flex items-baseline justify-between gap-8 w-full">
              <FieldLabel htmlFor="angle">Rotation angle</FieldLabel>
              <div className="relative flex items-center">
                <ScrubbableInput
                  id="angle"
                  value={angle}
                  onValueChange={setAngle}
                  min={0}
                  max={360}
                  className="h-auto w-32 [appearance:textfield] border-transparent bg-transparent! pr-6 pl-3 text-right text-4xl! font-bold tracking-tighter shadow-none focus-visible:border-transparent focus-visible:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <span className="absolute right-0 top-1/2 -translate-y-1/2 text-4xl font-bold opacity-70 pointer-events-none">°</span>
              </div>
            </div>
            <div className="flex justify-center w-full">
              <Knob value={angle} onValueChange={setAngle} />
            </div>
          </Field>
        </FieldGroup>
      </div>
    </div>
  );
};
