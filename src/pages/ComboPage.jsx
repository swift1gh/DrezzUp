import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Selected from "../components/Selected";

const ComboPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedIds = queryParams.get("ids")
    ? queryParams.get("ids").split(",")
    : [];

  return (
    <div>
      <Navbar Btn={"Home"} Destination="/" />
      <Selected selectedIds={selectedIds} />
    </div>
  );
};

export default ComboPage;
