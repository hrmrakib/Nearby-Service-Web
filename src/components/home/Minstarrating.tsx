"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StarOption {
  value: number;
  label: string;
  filledCount: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STAR_OPTIONS: StarOption[] = [
  { value: 5, label: "(5 Stars)", filledCount: 5 },
  { value: 4, label: "(4+ Stars)", filledCount: 4 },
  { value: 3, label: "(3+ Stars)", filledCount: 3 },
  { value: 2, label: "(2+ Stars)", filledCount: 2 },
  { value: 1, label: "(1+ Stars)", filledCount: 1 },
];

const TOTAL_STARS = 5;

// ─── Sub-components ───────────────────────────────────────────────────────────

interface StarIconProps {
  filled: boolean;
}

function StarIcon({ filled }: StarIconProps) {
  return filled ? (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      className='w-4 h-4'
      aria-hidden='true'
    >
      <path
        d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
        fill='#16a34a'
        stroke='#16a34a'
        strokeWidth='1'
        strokeLinejoin='round'
      />
    </svg>
  ) : (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      className='w-4 h-4'
      aria-hidden='true'
    >
      <path
        d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
        fill='none'
        stroke='#d1d5db'
        strokeWidth='1.5'
        strokeLinejoin='round'
      />
    </svg>
  );
}

interface StarRowProps {
  option: StarOption;
  isSelected: boolean;
  onToggle: (value: number) => void;
}

function StarRow({ option, isSelected, onToggle }: StarRowProps) {
  const id = `star-rating-${option.value}`;

  return (
    <div
      className={[
        "flex items-center gap-3 py-1.5 rounded-xl transition-colors duration-150 cursor-pointer group",
        isSelected ? "bg-transparent" : "hover:bg-gray-100",
      ].join(" ")}
      onClick={() => onToggle(option.value)}
      role='row'
    >
      {/* Checkbox */}
      <Checkbox
        id={id}
        checked={isSelected}
        onCheckedChange={() => onToggle(option.value)}
        onClick={(e) => e.stopPropagation()}
        className={[
          "w-4 h-4 rounded-md border-2 transition-colors duration-150",
          isSelected
            ? "border-green-600 bg-green-600 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
            : "border-gray-300 bg-white",
        ].join(" ")}
      />

      {/* Stars */}
      <div
        className='flex items-center gap-1'
        aria-label={`${option.filledCount} out of 5 stars`}
      >
        {Array.from({ length: TOTAL_STARS }, (_, i) => (
          <StarIcon key={i} filled={i < option.filledCount} />
        ))}
      </div>

      {/* Label */}
      <Label
        htmlFor={id}
        className={[
          "text-base font-medium cursor-pointer select-none transition-colors duration-150",
          isSelected
            ? "text-green-700"
            : "text-gray-600 group-hover:text-gray-800",
        ].join(" ")}
      >
        {option.label}
      </Label>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface MinStarRatingProps {
  onChange?: (selected: number[]) => void;
}

export default function MinStarRating({ onChange }: MinStarRatingProps) {
  const [selected, setSelected] = useState<number[]>([]);

  const handleToggle = (value: number): void => {
    const updated = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];

    setSelected(updated);
    onChange?.(updated);
  };

  return (
    <div className='bg-transparent'>
      <div className='bg-transparent'>
        {/* Title */}
        <h2 className='text-lg font-semibold text-gray-800 mb-4'>
          Min. Star Rating
        </h2>

        {/* Options */}
        <div
          className='flex flex-col gap-1'
          role='group'
          aria-label='Minimum star rating filter'
        >
          {STAR_OPTIONS.map((option) => (
            <StarRow
              key={option.value}
              option={option}
              isSelected={selected.includes(option.value)}
              onToggle={handleToggle}
            />
          ))}
        </div>

        {/* Selected summary (optional UX hint) */}
        {/* {selected.length > 0 && (
          <p className='mt-4 text-xs text-green-600 font-medium px-3'>
            {selected.length === 1
              ? `Filtering by ${selected[0]}+ stars`
              : `Filtering by: ${selected
                  .sort((a, b) => b - a)
                  .map((v) => `${v}+`)
                  .join(", ")} stars`}
          </p>
        )} */}
      </div>
    </div>
  );
}
