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
import { AuthProvider } from "./hooks/useAuth.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";
import ProductUpload from "./pages/ProductUpload.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx"; // Import AuthLayout

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="combo" element={<ComboPage />} />
      </Route>

      <Route path="login" element={<AdminLogin />} />

      {/* Protecting Admin Routes */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route element={<AuthLayout />}>
          {" "}
          {/* Wrap with AuthLayout */}
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="productupload" element={<ProductUpload />} />
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
