import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { Dispatch, SetStateAction } from "react";

interface ControlPanelProps {
  circleRad: number;
  setCircleRad: Dispatch<SetStateAction<number>>;
  circleGap: number;
  setCircleGap: Dispatch<SetStateAction<number>>;
}

export const ControlPanel = ({ circleRad, setCircleRad, circleGap, setCircleGap }: ControlPanelProps) => {
  return (
    <Collapsible className="absolute left-1 w-dvw max-w-40">
      <CollapsibleTrigger className="bg-gray-900 px-5 py-3">...</CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        <Card>
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
                className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="circleRad">Gap between discs</FieldLabel>
              <Input
                type="number"
                id="circleRad"
                value={circleGap}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setCircleGap(Number(event?.target?.value));
                }}
                className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </Field>
          </FieldGroup>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
};
