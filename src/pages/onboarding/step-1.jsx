import React, { useState, useContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useTheme } from "styled-components";
import { Typography, App } from "antd";

import { addProfile } from "./hooks";
import { OnboardingContext } from "./context";

import {
  StyledInput,
  StyledStickyContainer,
  StyledButton,
} from "../../styled-components";
import { Container } from "./styled";
import UploadImages from "../../shared-components/UploadImages";
import { getFirebase } from "../../firebase";

const Step1 = () => {
  const theme = useTheme();
  const { message } = App.useApp();
  const { nextStep, setProfileId } = useContext(OnboardingContext);
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [loading, setLoading] = useState(false);

  const { auth } = getFirebase();
  const [user, userLoading] = useAuthState(auth);

  const createNewProfile = async () => {
    if (!name || !logo) {
      message.error("Please enter your profile name and logo.");
      return;
    }
    setLoading(true);
    try {
      await addProfile(user.uid, { name, logo });
      setProfileId(user.uid);
      nextStep();
    } catch (error) {
      console.log(error);
      message.error("Something went wrong. Please try again later.");
    }
    setLoading(false);
  };

  const handleUploadImages = (images) => {
    if (images.length === 0) return;
    const logo = images[0].response?.downloadURL;
    setLogo(logo);
  };

  return (
    <>
      <Container>
        <Typography.Title level={3}>
          Add your Profile name and logo
        </Typography.Title>
        <Typography.Title level={5} style={{ opacity: 0.8 }}>
          Your Profile Name
        </Typography.Title>
        <StyledInput
          type='text'
          placeholder='Please enter your name'
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <div style={{ marginTop: theme.space[8] }}>
          <Typography.Title level={5} style={{ opacity: 0.8 }}>
            Your Logo
          </Typography.Title>
          <UploadImages limit={1} onSuccess={handleUploadImages} />
        </div>
      </Container>
      <StyledStickyContainer>
        <StyledButton
          onClick={createNewProfile}
          style={{
            margin: "0px",
          }}
          loading={loading || userLoading}
        >
          Proceed to next step
        </StyledButton>
      </StyledStickyContainer>
    </>
  );
};

export default Step1;
