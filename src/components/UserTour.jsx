import React, { useState, useEffect } from "react";
import Joyride from "react-joyride";

const UserTour = () => {
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    // For testing only: clear the flag so the tour re-runs
    localStorage.removeItem("hasSeenTour");

    if (!localStorage.getItem("hasSeenTour")) {
      const isMobile = window.innerWidth < 768;

      // Decide which search element to highlight
      const searchStep = isMobile
        ? {
            target: "#mobile-search",
            content: "🔍 Tap here to search for sneakers!",
            placement: "bottom",
          }
        : {
            target: "#search-bar",
            content: "🔍 Use this search bar to find sneakers by name!",
            placement: "bottom",
          };

      // Highlight fewer sneakers so they fit in the viewport
      const sneakerStep = {
        target: isMobile
          ? "#sneakers > div:nth-child(-n+3)" // Fewer items on mobile
          : "#sneakers > div:nth-child(-n+2)", // Even fewer on desktop
        content: "🛒 Select at least two(2) sneakers to create your combo.",
        placement: "top",
      };

      setSteps([
        {
          target: "#logo",
          content:
            "👋 Welcome to DREZZUP Store!! This website was designed for you, to help you create sneaker combos and place orders easily.",
          placement: "bottom",
        },
        searchStep,
        {
          target: "#filters",
          content: "🎨 Use these filters to browse sneakers by brand.",
          placement: "bottom",
        },
        sneakerStep,
        {
          target: "#calculate-btn",
          content:
            "💰 Click **Calculate Combo** to see your total price instantly!",
          placement: "bottom",
        },
      ]);
    }
  }, []);

  useEffect(() => {
    if (steps.length > 0) {
      setRun(true);
      localStorage.setItem("hasSeenTour", "true");
    }
  }, [steps]);

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showSkipButton
      showCloseButton
      disableOverlayClose
      disableScroll // Prevent auto-scrolling
      scrollToFirstStep={false} // Don't scroll on first step
      spotlightClicks
      // Pass floaterProps to disable repositioning animations & offset adjustments
      floaterProps={{
        disableAnimation: true,
        offset: 0,
      }}
      styles={{
        options: {
          arrowColor: "#d29c7b",
          backgroundColor: "#222",
          primaryColor: "#d29c7b",
          textColor: "#fff",
          zIndex: 1000,
        },
        tooltip: {
          borderRadius: "20px",
          padding: "15px",
          fontSize: "16px",
          fontWeight: "bold",
          boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
        },
        buttonClose: { color: "#fff" },
        buttonNext: {
          backgroundColor: "#d29c7b",
          borderRadius: "6px",
          padding: "8px 15px",
        },
        buttonBack: {
          color: "#d29c7b",
          fontSize: "14px",
        },
        spotlight: {
          padding: 1,
          borderRadius: "10px",
        },
      }}
      callback={(data) => {
        if (data.status === "finished" || data.status === "skipped") {
          setRun(false);
        }
      }}
    />
  );
};

export default UserTour;
