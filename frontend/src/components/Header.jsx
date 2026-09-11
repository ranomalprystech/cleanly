import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/components/Header.scss";

const Header = ({ isLoggedIn, isAdmin = false, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAuthClick = () => {
    if (isLoggedIn) {
      if (onLogout) onLogout();
      setIsMenuOpen(false);
      navigate("/");
    } else {
      setIsMenuOpen(false);
      navigate("/auth");
    }
  };

  return (
    <header className="header">
      <div className="header__container">
        {/* Logo */}
        <Link to="/" className="header__logo-link">
          <img
            src="https://cleanly-700a6.firebaseapp.com/static/media/logo.8ff229fcc20562bae2d7.png"
            alt="Cleanly"
          />
        </Link>

        {/* Desktop Actions */}
        <div className="header__desktop-actions">
          <nav className="header__nav">
            <a href="#how-it-works">How It Works</a>
            <a href="#services">Our Services</a>
            {isAdmin ? (
              <Link to="/dashboard">Dashboard</Link>
            ) : (
              isLoggedIn && <Link to="/recent-bookings">Recent Bookings</Link>
            )}
            {/* {isAdmin && <Link to="/dashboard">Dashboard</Link>} */}
          </nav>

          <button
            className="header__book-btn"
            type="button"
            onClick={() => navigate("/booking")}
          >
            Book a Cleaning
          </button>

          <button
            className={`header__login-btn ${isLoggedIn ? "logged-in" : ""}`}
            type="button"
            onClick={handleAuthClick}
          >
            {isLoggedIn ? "Logout" : "Login"}
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className={`header__menu-btn ${isMenuOpen ? "active" : ""}`}
          type="button"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`header__mobile-menu ${isMenuOpen ? "active" : ""}`}>
        <nav className="header__mobile-nav">
          <a href="#how-it-works" onClick={() => setIsMenuOpen(false)}>
            How It Works
          </a>
          <a href="#services" onClick={() => setIsMenuOpen(false)}>
            Our Services
          </a>

          {isAdmin ? (
            <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
              Dashboard
            </Link>
          ) : (
            isLoggedIn && (
              <Link to="/recent-bookings" onClick={() => setIsMenuOpen(false)}>
                Recent Bookings
              </Link>
            )
          )}

          {/* {isAdmin && (
            <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
              Dashboard
            </Link>
          )} */}

          <button
            className="header__book-btn"
            type="button"
            onClick={() => {
              setIsMenuOpen(false);
              navigate("/booking");
            }}
          >
            Book a Cleaning
          </button>

          <button
            className={`header__login-btn ${isLoggedIn ? "logged-in" : ""}`}
            type="button"
            onClick={handleAuthClick}
          >
            {isLoggedIn ? "Logout" : "Login"}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
