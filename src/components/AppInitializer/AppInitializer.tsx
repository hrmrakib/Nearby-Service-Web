"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setProfileLoading, setUser } from "@/redux/features/auth/authSlice";
import { useGetProfileQuery } from "@/redux/features/profile/profileAPI";

export default function AppInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const { data, isLoading } = useGetProfileQuery({}, { skip: !token });

  useEffect(() => {
    dispatch(setProfileLoading(isLoading));
  }, [isLoading]);

  useEffect(() => {
    if (data?.data) {
      dispatch(setUser({ user: data.data, token }));
    }
  }, [data]);

  return children;
}
