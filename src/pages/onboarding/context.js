import React, { useState, createContext } from "react";

const OnboardingContext = createContext({
  step: 0,
  setStep: () => {},
  direction: 0,
  profileId: null,
  nextStep: () => {},
  prevStep: () => {},
});

// provider
const OnboardingProvider = ({ children }) => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [profileId, setProfileId] = useState(null);

  return (
    <OnboardingContext.Provider
      value={{
        step,
        setStep,
        direction,
        nextStep: () => {
          setStep((prev) => prev + 1);
          setDirection(1);
        },
        prevStep: () => {
          setStep((prev) => prev - 1);
          setDirection(-1);
        },
        profileId,
        setProfileId,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export { OnboardingContext, OnboardingProvider };
