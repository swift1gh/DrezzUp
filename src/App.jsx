import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import React from "react";
import HomePage from "./pages/HomePage.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import ComboPage from "./pages/ComboPage.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ProductUpload from "./pages/ProductUpload.jsx";
import { AuthProvider } from "./hooks/useAuth.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="combo" element={<ComboPage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AuthLayout />}>
        <Route path="login" element={<AdminLogin />} />
        <Route element={<PrivateRoute />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="productUpload" element={<ProductUpload />} />
        </Route>
      </Route>
    </>
  )
);

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
