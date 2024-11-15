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
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import { AuthProvider } from "./hooks/useAuth.jsx"; // Import AuthProvider
import PrivateRoute from "./components/PrivateRoute.jsx"; // Import PrivateRoute
import ProductUpload from "./pages/ProductUpload.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path="combo" element={<ComboPage />} />
      <Route path="adminLogin" element={<AdminLogin />} />
      <Route
        path="adminDashboard"
        element={<PrivateRoute element={<AdminDashboard />} />}
      />
      <Route path="productUpload" element={<ProductUpload />} />
    </Route>
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
