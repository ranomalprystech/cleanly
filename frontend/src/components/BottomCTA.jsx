import { useNavigate } from "react-router-dom";
import "../styles/components/BottomCTA.scss";

const BottomCTA = () => {

  const navigate = useNavigate();

  return (
    <section className="bottom-cta">
      <div className="bottom-cta__container">
        <h2>Don't wait, Book a cleaning now.</h2>

        <p>
          Book expert home cleaners and handymen at a moment's notice. Just pick
          a time and we'll do the rest.
        </p>

        <form className="bottom-cta__form">
          <input type="email" placeholder="Email Address" />

          <input type="text" placeholder="Zip Code" />

          <button type="submit" onClick={() => navigate('/booking')}>
            Continue <span>›</span>
          </button>
        </form>
      </div>
    </section>
  );
};

export default BottomCTA;
