import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";

import { getFirebase } from "../firebase";
import Store from "../store";
import Spinner from "../shared-components/Spinner";
import TopBar from "../shared-components/TopBar";
import Footer from "../shared-components/Footer";
import SplashPage from "../pages/splash-page";

const { auth } = getFirebase();
const { ProfileContext } = Store;

const WithTopAndBottom = ({ children }) => {
  const navigate = useNavigate();
  const { addNew } = useContext(ProfileContext);
  const [splash, setSplash] = useState(true);

  const [user, loading] = useAuthState(auth);
  const [signOut] = useSignOut(auth);

  useEffect(() => {
    if (user === null && !loading) {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate, loading]);

  // useEffect(() => {
  //   if (!user) return;
  //   else if (user) navigate("/");
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [store]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (splash) return <SplashPage />;

  return (
    <>
      <TopBar handleClick={user ? () => signOut() : null} />
      {loading ? <Spinner /> : children}
      {!addNew && <Footer />}
    </>
  );
};

export default WithTopAndBottom;
