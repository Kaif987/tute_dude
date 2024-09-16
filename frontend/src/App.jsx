import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/custom/ProtectedRoute";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        {/* <Route path='/admin/dashboard' element={<AdminDashboard />} /> */}
        {/* <Route path='/project/update/:id' element={<UpdateProject />} /> */}
      </Route>

      {/* Redirect to home if no match */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
