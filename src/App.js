import React, { useState, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import { ConfigProvider, App as AntdApp } from "antd";

import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import OnboardingPage from "./pages/onboarding";
import ErrorPage from "./pages/error-page/not-found-page";
import { getFirebase } from "./firebase";
import WithTopAndBottom from "./hoc/WithTopAndBottom";
import Store from "./store";

const { ThemeContext, ProfileContext } = Store;

const Container = styled.div`
  width: 100%;
  max-width: 768px;
  margin: 0 auto;
  p {
    margin: 0px;
    padding: 0px;
    font-size: ${(props) => props.theme.fontSizes[1]};
  }
`;

const App = () => {
  const theme = useContext(ThemeContext);
  const [profile, setProfile] = useState(null);
  const [addNew, setAddNew] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const { app } = getFirebase();

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: theme.colors.primary,
          background: theme.bg.default,
          fontFamily: theme.fonts.primary,
        },
      }}
    >
      <ThemeProvider theme={theme}>
        <ProfileContext.Provider value={{ profile, setProfile, addNew, setAddNew }}>
          <AntdApp>
            <Container>
              <WithTopAndBottom>
                <Routes>
                  <Route path='/' exact element={<HomePage />} />
                  <Route path='/login' exact element={<LoginPage />} />
                  <Route
                    path='/onboarding'
                    exact
                    element={<OnboardingPage />}
                  />
                  <Route path='*' element={<ErrorPage />} />
                </Routes>
              </WithTopAndBottom>
            </Container>
          </AntdApp>
        </ProfileContext.Provider>
      </ThemeProvider>
    </ConfigProvider>
  );
};

export default App;
