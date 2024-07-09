import React, { useState } from "react";
import SplashScreen from "./SplashScreen";
import RegisterForm from "../app/authentification/RegisterForm"; 
import LoginForm from "../app/authentification/LoginForm";

export default function Layout() {
  const [isAppReady, setAppReady] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleSplashScreenFinish = () => {
    setAppReady(true);
  };

  const navigateToLogin = () => {
    setShowLogin(true);
  };

  const navigateToRegister = () => {
    setShowLogin(false);
  };

  if (!isAppReady) {
    return <SplashScreen onFinish={handleSplashScreenFinish} />;
  }

  if (showLogin) {
    return <LoginForm navigateToRegister={navigateToRegister} />;
  }

  return <RegisterForm navigateToLogin={navigateToLogin} />;
}
