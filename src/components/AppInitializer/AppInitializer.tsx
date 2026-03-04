"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/features/auth/authSlice";
import { useGetProfileQuery } from "@/redux/features/profile/profileAPI";

export default function AppInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const { data } = useGetProfileQuery({}, { skip: !token });

  useEffect(() => {
    if (data?.data) {
      dispatch(setUser({ user: data.data, token }));
    }
  }, [data]);

  return children;
}
