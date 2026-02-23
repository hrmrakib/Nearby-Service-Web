"use client";

import { useState } from "react";

function AddressDisplay({ address }: { address: string }) {
  const [expanded, setExpanded] = useState(false);
  const short = address.split(",")[0];
  const hasMore = address.split(",").length > 1;

  return (
    <span className='text-sm text-white'>
      {expanded ? address : short}
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className='ml-1 text-[#15B826] hover:underline text-xs font-medium'
        >
          {expanded ? "show less" : "show more"}
        </button>
      )}
    </span>
  );
}

export default AddressDisplay;
