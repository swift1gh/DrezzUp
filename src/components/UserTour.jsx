<<<<<<< Updated upstream
import React, { useState, useEffect, useRef } from "react";
import Joyride, { STATUS, EVENTS } from "react-joyride";

// Import tour components
import TourButton from "./tour/TourButton";
import TourStepGenerator from "./tour/TourStepGenerator";
import TourStyles from "./tour/TourStyles";
=======
import React, { useState, useEffect } from "react";
import Joyride from "react-joyride";
>>>>>>> Stashed changes

const UserTour = () => {
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState([]);
<<<<<<< Updated upstream
  const [stepIndex, setStepIndex] = useState(0);
  const joyrideRef = useRef(null);
  const [elementsReady, setElementsReady] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Check if elements are ready for the tour
  useEffect(() => {
    let checkInterval;

    if (run && !elementsReady) {
      checkInterval = setInterval(() => {
        if (TourStepGenerator.checkElementsExist()) {
          console.log("All tour elements are ready");
          setElementsReady(true);
          clearInterval(checkInterval);

          // Regenerate steps now that elements are ready
          const newSteps = TourStepGenerator.generateSteps(isMobile);
          setSteps(newSteps);
        } else {
          console.log("Waiting for tour elements to be ready...");
        }
      }, 500);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [run, elementsReady, isMobile]);

  // Initialize tour on component mount and handle window resize
  useEffect(() => {
    console.log("UserTour component mounted");

    // Handle window resize
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      setIsMobile(newIsMobile);
      
      if (run) {
        // Regenerate steps and restart tour on significant resize
        console.log("Window resized, regenerating steps");
        const newSteps = TourStepGenerator.generateSteps(newIsMobile);
        setSteps(newSteps);
      }
    };

    // Add resize listener with debounce
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 300);
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, [run]);

  // Start the tour
  const startTour = () => {
    console.log("Starting tour");
    setStepIndex(0);
    setElementsReady(false);

    // Initial steps generation
    const newSteps = TourStepGenerator.generateSteps(isMobile);
    setSteps(newSteps);
    setRun(true);
  };

  // Handle tour callback events
  const handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data;
    console.log("Tour callback:", { action, index, status, type });

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      console.log("Tour finished or skipped");
      setRun(false);
    } else if (type === EVENTS.STEP_AFTER && action === "next") {
      // Update step index for controlled tour
      setStepIndex(index + 1);
    } else if (type === EVENTS.STEP_AFTER && action === "prev") {
      // Update step index for controlled tour
      setStepIndex(index - 1);
    } else if (type === EVENTS.TARGET_NOT_FOUND) {
      console.error(`Target not found for step ${index + 1}`);

      // Skip the problematic step
      if (index < steps.length - 1) {
        setStepIndex(index + 1);
      } else {
        setRun(false);
      }
    }
  };

  return (
    <>
      {!run && <TourButton startTour={startTour} isMobile={isMobile} />}

      {run && steps.length > 0 && (
        <Joyride
          ref={joyrideRef}
          steps={steps}
          run={run && elementsReady}
          stepIndex={stepIndex}
          continuous
          showSkipButton
          showCloseButton
          disableOverlayClose
          disableScrolling={false}
          scrollToFirstStep={true}
          scrollToSteps={true}
          spotlightClicks={false}
          callback={handleJoyrideCallback}
          styles={TourStyles}
          floaterProps={{
            disableAnimation: true
          }}
          spotlightPadding={10}
          hideBackButton={false}
        />
      )}
    </>
=======

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
>>>>>>> Stashed changes
  );
};

export default UserTour;
