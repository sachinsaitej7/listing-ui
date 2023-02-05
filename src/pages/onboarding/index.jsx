import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";

import { getFirebase } from "../../firebase";
import { useUserProfile } from "./hooks";
//context
import { OnboardingProvider, OnboardingContext } from "./context";

//images
import { ReactComponent as LeftArrow } from "../../assets/common/arrow-left.svg";

import { PageContainer } from "../../styled-components";
import Spinner from "../../shared-components/Spinner";

import Step0 from "./step-0";
import Step1 from "./step-1";
import Step2 from "./step-2";

const variants = {
  enter: (direction) => {
    return {
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      height: "80vh",
    };
  },
  center: {
    x: 0,
    opacity: 1,
    transition: {
      delay: 0.2,
    },
  },
  exit: (direction) => {
    return {
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      display: "none",
    };
  },
};

const StyledContainer = styled(PageContainer)`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;

  .back {
    cursor: pointer;
    margin-top: ${(props) => props.theme.space[8]};
    width: 24px;
  }
`;

const StyledStepContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: ${(props) => props.theme.space[3] + " " + props.theme.space[0]};
`;

const StyledStep = styled.div`
  background-color: ${(props) => (props.active ? "#3785FD" : "#D9D9D9")};
  padding: 2.5px;
  width: 23%;
`;

const OnboardingPage = () => {
  const { auth } = getFirebase();
  const navigate = useNavigate();
  const [user, userLoading] = useAuthState(auth);
  const [profile, profileLoading] = useUserProfile(user?.uid);

  const { step, prevStep, direction, setProfileId, setStep } =
    useContext(OnboardingContext);

  useEffect(() => {
    if (!profile) return;
    setProfileId(profile.id);
    if (!profile.status) setStep(2);
    if (profile.status) navigate("/");
  }, [profile, setProfileId, setStep, navigate]);

  if (userLoading || profileLoading)
    return (
      <StyledContainer
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <Spinner />
      </StyledContainer>
    );
  
  if (profile?.status) return null;
  return (
    <StyledContainer>
      {step === 0 && <Step0 />}
      {step > 0 && (
        <>
          <StyledStepContainer>
            {Array(4)
              .fill(0)
              .map((_, i) => {
                return <StyledStep key={i} active={step > i}></StyledStep>;
              })}
          </StyledStepContainer>
          {step > 2 && <LeftArrow className='back' onClick={prevStep} />}
          <div style={{ width: "100%" }}>
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={variants}
                initial='enter'
                animate='center'
                exit='exit'
                // transition={{
                //   x: { type: "spring", stiffness: 30, damping: 10 },
                // }}
              >
                {step === 1 && <Step1 />}
                {step === 2 && <Step2 />}
              </motion.div>
            </AnimatePresence>
          </div>
        </>
      )}
    </StyledContainer>
  );
};

export default function Home() {
  return (
    <OnboardingProvider>
      <OnboardingPage />
    </OnboardingProvider>
  );
}
