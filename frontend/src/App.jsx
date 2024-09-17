import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/custom/ProtectedRoute";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import UserProfile from "./pages/UserProfilePage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/user/:id" element={<UserProfile />} />
        </Route>
        {/* Redirect to home if no match */}
        {/* <Route path="*" element={<Navigate to="/" />} /> */}
      </Routes>
    </>
  );
}

export default App;
