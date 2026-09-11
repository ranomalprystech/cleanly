import "../styles/components/CleaningServices.scss";

const CleaningServices = () => {
  const livingRoomServices = [
    "Cleaning and highrise dusting",
    "Furniture Dusting/Vacuuming",
    "Fixtures cleaning - A/C, Fan etc",
    "Wall marks cleaning (Washable paint)",
    "Floor scrubbing / Dry and Wet mop",
    "Carpet vacuuming",
  ];

  const kitchenServices = [
    "Wash and scrub sink",
    "Wash cabinet faces and appliances",
    "Dust and wipe all reachable surfaces",
    "Wipe mirrors and glass fixtures",
    "Vacuum and mop all floors",
    "Take out trash and recyclables",
  ];

  const TidyBathroom = [
    "Wash and sanitize toilet, shower and sink",
    "Dust and wipe all reachable surfaces",
    "Wipe door handles and light switches",
    "Wipe mirrors and glass fixtures",
    "Vacuum and mop all floors",
    "Take out trash and recyclables",
  ];

  const PerfectBedroom = [
    "Make beds and change linens",
    "Dust and wipe all reachable surfaces",
    "Wipe door handles and light switches",
    "Wipe mirrors and glass fixtures",
    "Vacuum and mop all floors",
    "Take out trash and recyclables",
  ];

  return (
    <section className="cleaning-services" id="services">
      {/* Living Room */}
      <div className="cleaning-services__row">
        <div className="cleaning-services__image">
          <img
            src="https://cleanly-700a6.firebaseapp.com/static/media/service-img1.7a9334cb22bde205d134.jpg"
            alt="Living Room Cleaning"
          />
        </div>

        <div className="cleaning-services__content">
          <h2>
            Make Better <span>Living room</span>
          </h2>

          <ul>
            {livingRoomServices.map((service, index) => (
              <li key={index}>{service}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Kitchen */}
      <div className="cleaning-services__row">
        <div className="cleaning-services__content">
          <h2>
            Your Beautiful <span>Kitchen</span>
          </h2>

          <ul>
            {kitchenServices.map((service, index) => (
              <li key={index}>{service}</li>
            ))}
          </ul>
        </div>

        <div className="cleaning-services__image">
          <img
            src="https://cleanly-700a6.firebaseapp.com/static/media/service-img2.8abf488885c7b31e8caf.jpg"
            alt="Your_Beautiful_Kitchen"
          />
        </div>
      </div>

      {/* Tidy Bathroom */}

      <div className="cleaning-services__row">
        <div className="cleaning-services__image">
          <img
            src="https://cleanly-700a6.firebaseapp.com/static/media/service-img3.bcc115f2a89e1f4744cc.jpg"
            alt="Living Room Cleaning"
          />
        </div>

        <div className="cleaning-services__content">
          <h2>
            Tidy <span>Bathroom</span>
          </h2>

          <ul>
            {TidyBathroom.map((service, index) => (
              <li key={index}>{service}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="cleaning-services__row">
        <div className="cleaning-services__content">
          <h2>
            The Perfect <span>Bedroom</span>
          </h2>

          <ul>
            {PerfectBedroom.map((service, index) => (
              <li key={index}>{service}</li>
            ))}
          </ul>
        </div>

        <div className="cleaning-services__image">
          <img
            src="https://cleanly-700a6.firebaseapp.com/static/media/service-img4.91fd7dd5f25bd223c7b7.jpg"
            alt="Your_Beautiful_Kitchen"
          />
        </div>
      </div>
    </section>
  );
};

export default CleaningServices;
