import useAuth from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const auth = useAuth();
  console.log(auth.user); // null!!

  if (auth.requestStatus === "pending") {
    return <h1>Loading...</h1>;
  }

  if (!auth.user) {
    return <Navigate to="/login" />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
