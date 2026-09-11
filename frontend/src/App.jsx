import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import TrustedCompanies from "./components/TrustedCompanies";
import HowItWorks from "./components/HowItWorks";
import Testimonials from "./components/Testimonials";
import CleaningServices from "./components/CleaningServices";
import BottomCTA from "./components/BottomCTA";
import Footer from "./components/Footer";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import Booking from "./components/Booking";
import FAQ from "./components/FAQ";
import RecentBookings from "./components/RecentBookings";

const Home = ({ isLoggedIn, isAdmin, handleLogout }) => {
  return (
    <>
      <Header
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />

      <main className="home-layout">
        <HeroSection />
        <TrustedCompanies />
        <HowItWorks />
        <Testimonials />
        <CleaningServices />
        <FAQ />
        <BottomCTA />
      </main>
    </>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return Boolean(localStorage.getItem("token"));
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const isAdmin = currentUser?.role === "admin";

  return (
    <>
      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={
            <Home
              isLoggedIn={isLoggedIn}
              isAdmin={isAdmin}
              handleLogout={handleLogout}
            />
          }
        />

        {/* Authentication */}
        <Route
          path="/auth"
          element={
            <Auth
              setIsLoggedIn={setIsLoggedIn}
              setCurrentUser={setCurrentUser}
            />
          }
        />

        {/* Booking */}
        <Route
          path="/booking"
          element={
            <Booking isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
          }
        />

        {/* Recent Bookings */}
        <Route
          path="/recent-bookings"
          element={
            isLoggedIn && !isAdmin ? (
              <RecentBookings
                isLoggedIn={isLoggedIn}
                handleLogout={handleLogout}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn && isAdmin ? (
              <Dashboard isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Unknown URL */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </>
  );
};

export default App;
