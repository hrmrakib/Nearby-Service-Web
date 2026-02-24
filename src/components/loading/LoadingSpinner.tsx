function LoadingSpinner({ text }: { text?: string }) {
  return (
    <div className='min-h-[90vh] bg-[#F3F4F6] flex items-center justify-center'>
      <div className='flex flex-col items-center gap-4'>
        {/* Outer track */}
        <div className='relative w-16 h-16'>
          <div className='absolute inset-0 rounded-full border-4 border-green-100' />
          {/* Spinning arc */}
          <div className='absolute inset-0 rounded-full border-4 border-transparent border-t-green-500 animate-spin' />
          {/* Inner pulsing dot */}
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='w-3 h-3 rounded-full bg-green-500 animate-pulse' />
          </div>
        </div>
        <p className='text-sm font-medium text-green-600 tracking-wide animate-pulse'>
          Loading {text}...
        </p>
      </div>
    </div>
  );
}

export default LoadingSpinner;
