import { useNavigate } from "react-router-dom";
import "../styles/components/HeroSection.scss";


const HeroSection = () => {

  const navigate = useNavigate();

  return (
    <section className="hero">
      {/* Background Image */}
      <img
        src="https://cleanly-700a6.firebaseapp.com/static/media/landing-img.0e5af4d4b6224ab07a9b.jpg"
        alt="Professional home cleaning"
        className="hero__bg"
      />
      <div className="hero__overlay" />

      {/* Content */}
      <div className="hero__container">
        <div className="hero__content">
          <h1>Cleaning Made Easy</h1>

          <p>
            Book expert home cleaners and handymen at a moment's notice.
            <br />
            Just pick a time and we'll do the rest.
          </p>
        </div>

        {/* Booking Form */}
        <form className="hero__form">
          <div className="hero__input-group">
            <input type="email" placeholder="Email Address" />

            <input type="text" placeholder="Zip Code" />

            <button type="button" onClick={() => navigate("/booking")}>
              Continue <span>›</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default HeroSection;
