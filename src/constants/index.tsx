export const categories = [
  {
    id: "",
    label: "All",
    icon: (
      <svg
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth={1.8}
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <circle cx='4.5' cy='4.5' r='2' />
        <circle cx='12' cy='4.5' r='2' />
        <circle cx='19.5' cy='4.5' r='2' />
        <circle cx='4.5' cy='12' r='2' />
        <circle cx='12' cy='12' r='2' />
        <circle cx='19.5' cy='12' r='2' />
        <circle cx='4.5' cy='19.5' r='2' />
        <circle cx='12' cy='19.5' r='2' />
        <circle cx='19.5' cy='19.5' r='2' />
      </svg>
    ),
  },
  {
    id: "event",
    label: "Events",
    icon: (
      <svg
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth={1.8}
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <rect x='3' y='4' width='18' height='18' rx='2' />
        <path d='M16 2v4M8 2v4M3 10h18' />
        <path
          d='M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01'
          strokeWidth={2.5}
        />
      </svg>
    ),
  },
  {
    id: "deal",
    label: "Deals",
    icon: (
      <svg
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth={1.8}
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M12.5 2.5H19a.5.5 0 0 1 .5.5v6.5a.5.5 0 0 1-.15.35l-9.5 9.5a2 2 0 0 1-2.83 0l-3.87-3.87a2 2 0 0 1 0-2.83l9.5-9.5A.5.5 0 0 1 12.5 2.5Z' />
        <circle cx='16.5' cy='7.5' r='1.2' fill='currentColor' stroke='none' />
      </svg>
    ),
  },
  {
    id: "service",
    label: "Services",
    icon: (
      <svg
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth={1.8}
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77Z' />
      </svg>
    ),
  },
  {
    id: "alert",
    label: "Alerts",
    icon: (
      <svg
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth={1.8}
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9' />
        <path d='M10.3 21a1.94 1.94 0 0 0 3.4 0' />
      </svg>
    ),
  },
  {
    id: "nearby",
    label: "Nearby",
    icon: (
      <svg
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth={1.8}
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z' />
        <circle cx='12' cy='9' r='2.5' />
      </svg>
    ),
  },
  {
    id: "video",
    label: "Videos",
    icon: (
      <svg
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth={1.8}
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <rect x='2' y='5' width='15' height='14' rx='2' />
        <path d='m17 9 5-3v12l-5-3V9Z' />
      </svg>
    ),
  },
  {
    id: "saved",
    label: "Saved",
    icon: (
      <svg
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth={1.8}
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16Z' />
      </svg>
    ),
  },
  {
    id: "following",
    label: "Following",
    icon: (
      <svg
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth={1.8}
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3Z' />
        <path d='M8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3Z' />
        <path d='M8 14c-3.33 0-5 1.67-5 2.5V18h10v-1.5c0-.83-1.67-2.5-5-2.5Z' />
        <path d='M16 14c.96 0 1.83.17 2.56.44M19 17v-1' />
        <path d='M21 16h-4' />
      </svg>
    ),
  },
  {
    id: "attending",
    label: "Attending",
    icon: (
      <svg
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth={1.8}
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M22 11.08V12a10 10 0 1 1-5.93-9.14' />
        <path d='M22 4 12 14.01l-3-3' />
      </svg>
    ),
  },
];
