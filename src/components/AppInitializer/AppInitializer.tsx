"use client";

import { useGetProfileQuery } from "@/redux/features/profile/profileAPI";

export default function AppInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useGetProfileQuery(undefined);

  if (isLoading) return null;

  return <>{children}</>;
}
