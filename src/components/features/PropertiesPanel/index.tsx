import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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
    <div className="bg-sidebar border-sidebar-border pointer-events-auto flex h-full w-80 flex-col border-r shadow-xl">
      <div className="border-sidebar-border flex items-center justify-between border-b p-4">
        <h2 className="text-sidebar-foreground text-lg font-semibold tracking-tight">Properties</h2>
        <button
          onClick={onClose}
          className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md p-1 transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="circleRad">Radius of the disc</FieldLabel>
            <Input
              type="number"
              id="circleRad"
              value={circleRad}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setCircleRad(Number(event?.target?.value));
              }}
              className="bg-background [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="circleGap">Gap between discs</FieldLabel>
            <Input
              type="number"
              id="circleGap"
              value={circleGap}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setCircleGap(Number(event?.target?.value));
              }}
              className="bg-background [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </Field>
        </FieldGroup>
      </div>
    </div>
  );
};
