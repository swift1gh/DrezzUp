import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Selected from "../components/Selected";
import Footer from "../components/Footer";
import OrderForm from "../components/OrderForm";

const ComboPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedIds = queryParams.get("ids")
    ? queryParams.get("ids").split(",")
    : [];

  // Scroll to the top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar Btn={"Home"} Destination="/" />

      <main className="flex-grow">
        <Selected selectedIds={selectedIds} />
        {selectedIds.length > 1 && <OrderForm selectedIds={selectedIds} />}{" "}
        {/* Pass selectedIds to OrderForm */}
      </main>
      <br />
      <br />
      <Footer />
    </div>
  );
};

export default ComboPage;
