import CanvasComponent from "./components/features/Canvas";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "./components/ui/input";
import { useState } from "react";

function App() {
  const [circleRad, setCircleRad] = useState(40);
  const [circleGap, setCircleGap] = useState(30);
  return (
    <>
      <Collapsible className="absolute left-1 w-dvw max-w-40">
        <CollapsibleTrigger className="bg-gray-900 px-5 py-3">...</CollapsibleTrigger>
        <CollapsibleContent className="mt-2 bg-gray-900 p-5">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="circleRad">Radius of the disc</FieldLabel>
              <Input
                id="circleRad"
                value={circleRad}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setCircleRad(Number(event?.target?.value));
                }}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="circleRad">Gap between discs</FieldLabel>
              <Input
                id="circleRad"
                value={circleGap}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setCircleGap(Number(event?.target?.value));
                }}
              />
            </Field>
          </FieldGroup>
        </CollapsibleContent>
      </Collapsible>

      <CanvasComponent circleRad={circleRad} circleGap={circleGap} />
    </>
  );
}

export default App;
