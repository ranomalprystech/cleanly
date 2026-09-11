import "../styles/components/HowItWorks.scss";
import Booking_Call from "../assets/icons/Booking_Call.svg";
import Confirm_Booking from "../assets/icons/Confirm_Booking.svg";
import Home_clean from "../assets/icons/Home_clean.svg";

const HowItWorks = () => {
  return (
    <section className="how-it-works" id="how-it-works">
      <div className="how-it-works__container">
        {/* Heading */}
        <div className="how-it-works__heading">
          <h2>
            How It <span>Works</span>
          </h2>

          <p>
            We've made all the hardwork for making it simple for you. Here's how
            it works.
          </p>
        </div>

        {/* Steps */}
        <div className="how-it-works__steps">
          {/* Step 1 */}
          <div className="how-it-works__step">
            <div className="how-it-works__icon">
              <img src={Booking_Call} alt="Booking Call" />
            </div>

            <h3>Book a Cleaning</h3>

            <p>
              Click the book now button to make a booking on your preferred date
              and time.
            </p>
          </div>

          {/* Step 2 */}
          <div className="how-it-works__step">
            <div className="how-it-works__icon">
              <img src={Confirm_Booking} alt="Confirm Booking" />
            </div>

            <h3>Confirm Booking</h3>

            <p>
              We will confirm your booking along with your instructions via
              secure transaction.
            </p>
          </div>

          {/* Step 3 */}
          <div className="how-it-works__step">
            <div className="how-it-works__icon">
              <img src={Home_clean} alt="Home Cleaning" />
            </div>

            <h3>We'll Clean it</h3>

            <p>
              Our trusted and experienced maid will come to your doorstep at the
              scheduled time for cleaning.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
