/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useEffect, useState } from "react";
import { autoComplete } from "@/lib/google";

type Prediction = {
  description: string;
  place_id: string;
};

export default function AutoCompleteLocation() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const load = setTimeout(async () => {
      if (!query) {
        setPredictions([]);
        return;
      }

      const result = await autoComplete(query);
      setPredictions(result);
    }, 300);

    return () => clearTimeout(load);
  }, [query]);

  console.log({ predictions });

  return (
    <Command className='rounded-lg border shadow-md md:min-w-[450px] h-auto'>
      <CommandInput
        value={query}
        onValueChange={(value) => setQuery(value)}
        placeholder='Search location...'
      />

      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading='Suggestions'>
          {predictions.map((item: Prediction) => (
            <CommandItem
              key={item.place_id}
              value={item.description}
              onSelect={() => setQuery(item.description)}
            >
              <span>{item.description}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />
      </CommandList>
    </Command>
  );
}
