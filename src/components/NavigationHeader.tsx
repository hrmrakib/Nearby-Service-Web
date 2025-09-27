"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface NavigationHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export function NavigationHeader({
  title,
  showBackButton = true,
  onBack,
}: NavigationHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className='flex items-center gap-4 mb-6'>
      {showBackButton && (
        <Button
          variant='ghost'
          size='sm'
          onClick={handleBack}
          className='p-2 hover:bg-gray-100'
        >
          <ArrowLeft className='w-6 h-6 text-[#1F2937]' />
        </Button>
      )}
      <h1 className='text-2xl font-semibold text-[#1F2937]'>{title}</h1>
    </div>
  );
}
