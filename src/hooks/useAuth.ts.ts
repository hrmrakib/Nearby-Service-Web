import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export function useAuth() {
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

  return {
    user,
    token,
    isLoggedIn: !!user,
    userLat: user?.location?.coordinates[1],
    userLng: user?.location?.coordinates[0],
  };
}
