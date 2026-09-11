import "../styles/components/TrustedCompanies.scss";

const TrustedCompanies = () => {
  return (
    <section className="trusted-companies">
      <div className="trusted-companies__container">
        {/* Section Title */}
        <div className="trusted-companies__title">
          <span></span>
          <p>AS SEEN ON</p>
          <span></span>
        </div>

        <div className="trusted-companies__logos">
          <img
            src="https://cleanly-700a6.firebaseapp.com/static/media/client1.def0ab85012bfbad060c.png"
            alt="TechLaunch_Logo"
          />

          <img
            src="https://cleanly-700a6.firebaseapp.com/static/media/client2.285e61e534a0bdf2f0e9.png"
            alt="TECH_COMPANY_Logo"
          />

          <img
            src="https://cleanly-700a6.firebaseapp.com/static/media/client2.285e61e534a0bdf2f0e9.png"
            alt="Smart_Review_Logo"
          />

          <img
            src="https://cleanly-700a6.firebaseapp.com/static/media/client4.954aae51fbeed8c38fd5.png"
            alt="MobWorld_Logo"
          />
        </div>
      </div>
    </section>
  );
};

export default TrustedCompanies;
