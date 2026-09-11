import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import "../styles/components/Booking.scss";

// const API_BASE_URL = "http://localhost:5000/api";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const defaultServiceConfig = {
  cleaningTypes: {
    standard: { perRoomRate: 50, perBathRate: 60, addons: [] },
    deep: { perRoomRate: 75, perBathRate: 85, addons: [] },
    moveInOut: { perRoomRate: 100, perBathRate: 110, addons: [] },
  },
  frequencyDiscounts: { oneTime: 0, weekly: 25, biWeekly: 15, monthly: 10 },
};

const cleaningTypeValues = {
  STANDARD: "Standard",
  DEEP: "Deep",
  "MOVE IN/OUT": "Move In-Out",
};

const addonValues = {
  oven: "Clean Oven",
  windows: "Clean Windows",
  fridge: "Clean Fridge",
};

const getToday = () => new Date().toISOString().slice(0, 10);
const formatBookingDate = (value) => {
  if (!value) return "Select a date";

  const [year, month, day] = value.split("-");
  return `${month}/${day}/${year}`;
};

const Booking = ({ isLoggedIn = false, handleLogout }) => {
  const navigate = useNavigate();
  const [cleaningType, setCleaningType] = useState("STANDARD");
  const [frequency, setFrequency] = useState("");
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);

  const [extras, setExtras] = useState({
    oven: false,
    windows: false,
    fridge: false,
  });

  const [specialRequirements, setSpecialRequirements] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookingDate, setBookingDate] = useState(getToday);
  const [personalDetails, setPersonalDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    zipCode: "",
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [serviceConfig, setServiceConfig] = useState(defaultServiceConfig);
  const [loadingServices, setLoadingServices] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [bookingConfirmation, setBookingConfirmation] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) navigate("/auth", { replace: true });
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/services`);
        const savedConfig = response.data?.serviceConfig || {};
        const legacyAddons = Array.isArray(savedConfig.addons)
          ? savedConfig.addons
          : [];
        setServiceConfig({
          ...defaultServiceConfig,
          ...savedConfig,
          cleaningTypes: {
            ...defaultServiceConfig.cleaningTypes,
            ...(savedConfig.cleaningTypes || {}),
            standard: {
              ...defaultServiceConfig.cleaningTypes.standard,
              addons: legacyAddons,
              ...(savedConfig.cleaningTypes?.standard || {}),
            },
            deep: {
              ...defaultServiceConfig.cleaningTypes.deep,
              addons: legacyAddons,
              ...(savedConfig.cleaningTypes?.deep || {}),
            },
            moveInOut: {
              ...defaultServiceConfig.cleaningTypes.moveInOut,
              addons: legacyAddons,
              ...(savedConfig.cleaningTypes?.moveInOut || {}),
            },
          },
          frequencyDiscounts: {
            ...defaultServiceConfig.frequencyDiscounts,
            ...(savedConfig.frequencyDiscounts || {}),
          },
        });
      } catch (serviceError) {
        console.error("Service pricing load failed:", serviceError);
        setError("Unable to load current pricing. Please try again.");
      } finally {
        setLoadingServices(false);
      }
    };

    loadServices();
  }, []);

  const selectedExtras = Object.entries(extras)
    .filter(([, selected]) => selected)
    .map(([key]) => addonValues[key]);

  const calculateTotal = () => {
    const ratesByType = {
      Standard: serviceConfig.cleaningTypes.standard,
      Deep: serviceConfig.cleaningTypes.deep,
      "Move In-Out": serviceConfig.cleaningTypes.moveInOut,
    };
    const discounts = {
      "ONE-TIME": serviceConfig.frequencyDiscounts.oneTime,
      WEEKLY: serviceConfig.frequencyDiscounts.weekly,
      "BI-WEEKLY": serviceConfig.frequencyDiscounts.biWeekly,
      MONTHLY: serviceConfig.frequencyDiscounts.monthly,
    };

    const rates =
      ratesByType[cleaningTypeValues[cleaningType]] || ratesByType.Standard;
    let total = bedrooms * rates.perRoomRate;
    total += bathrooms * rates.perBathRate;
    selectedExtras.forEach((extraName) => {
      const addon = rates.addons.find((item) => item.name === extraName);
      if (addon) total += addon.price;
    });

    return Number(
      (total - total * ((discounts[frequency] || 0) / 100)).toFixed(2),
    );
  };

  const formatPhoneNumber = (value) => {
    // Sirf numbers rakho
    const numbers = value.replace(/\D/g, "");

    // +1 ke baad maximum 10 digits
    const phoneDigits = numbers.startsWith("1")
      ? numbers.slice(1, 11)
      : numbers.slice(0, 10);

    if (phoneDigits.length === 0) {
      return "";
    }

    if (phoneDigits.length <= 3) {
      return `+1 (${phoneDigits}`;
    }

    if (phoneDigits.length <= 6) {
      return `+1 (${phoneDigits.slice(0, 3)}) ${phoneDigits.slice(3)}`;
    }

    return `+1 (${phoneDigits.slice(0, 3)}) ${phoneDigits.slice(
      3,
      6,
    )}-${phoneDigits.slice(6, 10)}`;
  };

  const updatePersonalDetail = (field, value) => {
    setPersonalDetails((current) => ({ ...current, [field]: value }));
  };

  const resetBookingForm = () => {
    setCleaningType("STANDARD");
    setFrequency("WEEKLY");
    setBedrooms(1);
    setBathrooms(1);
    setExtras({ oven: false, windows: false, fridge: false });
    setSpecialRequirements("");
    setSelectedTime("7:00 AM");
    setBookingDate(getToday());
    setPersonalDetails({
      name: "",
      email: "",
      phone: "",
      address: "",
      zipCode: "",
    });
    setAcceptedTerms(false);
  };

  const handleBookingSubmit = async () => {
    setError("");
    setSuccessMessage("");

    if (!acceptedTerms) {
      setError("Please accept the terms and conditions to continue.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/bookings/create`,
        {
          customerName: personalDetails.name,
          customerEmail: personalDetails.email,
          customerPhone: personalDetails.phone,
          address: personalDetails.address,
          zipCode: personalDetails.zipCode,
          cleaningType: cleaningTypeValues[cleaningType],
          frequency,
          bedrooms,
          bathrooms,
          extras: selectedExtras,
          specialReq: specialRequirements,
          bookingDate,
          timeSlot: selectedTime,
          status: "Pending",
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );

      const createdBooking = response.data?.booking;

      setBookingConfirmation(createdBooking);

      setSuccessMessage(
        `Booking created. Total: $${Number(
          createdBooking?.totalCost || calculateTotal(),
        ).toFixed(2)}`,
      );

      resetBookingForm();
    } catch (bookingError) {
      console.error("Booking submission failed:", bookingError);
      setError(
        bookingError.response?.data?.message ||
          "Unable to create booking. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const frequencyOptions = [
    { name: "ONE-TIME" },
    { name: "WEEKLY", discount: "SAVE UP TO 25% OFF", featured: true },
    { name: "BI-WEEKLY", discount: "SAVE UP TO 15% OFF" },
    { name: "MONTHLY", discount: "SAVE UP TO 10% OFF" },
  ];

  const toggleExtra = (extra) => {
    setExtras((prev) => ({
      ...prev,
      [extra]: !prev[extra],
    }));
  };

  return (
    <div className="booking-page">
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      {/* Page Heading */}
      <section className="booking-page__hero">
        <h1>Book your cleaning</h1>
        <p>Its time to book our cleaning service for your home or apartment.</p>
      </section>

      {/* Booking Layout */}
      <section className="booking-page__wrapper">
        {/* LEFT SIDE */}
        <div className="booking-form">
          {/* Cleaning Preferences */}
          <div className="booking-card">
            <div className="booking-card__header">
              <h2>Cleaning Preferences</h2>
            </div>

            <div className="booking-card__body">
              {/* Cleaning Type */}
              <div className="booking-field">
                <p>What type of cleaning?</p>

                <div className="booking-options booking-options--three">
                  {["STANDARD", "DEEP", "MOVE IN/OUT"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={
                        cleaningType === type
                          ? "booking-option active"
                          : "booking-option"
                      }
                      onClick={() => setCleaningType(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frequency */}
              <div className="booking-field">
                <p>How often would you like cleaning?</p>

                <div className="booking-options booking-options--four">
                  {frequencyOptions.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      className={`booking-option ${
                        frequency === item.name ? "active" : ""
                      } ${item.featured ? "featured" : ""}`}
                      onClick={() => setFrequency(item.name)}
                    >
                      {item.featured && <span className="ribbon-badge">★</span>}
                      {item.discount && (
                        <span className="discount-tooltip">
                          {item.discount}
                        </span>
                      )}
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="booking-divider"></div>

              {/* Home Details */}
              <div className="booking-section-title">
                <h3>Tell us about your home</h3>
              </div>

              <div className="booking-home-options">
                {/* Bedrooms */}
                <div className="room-card">
                  <div className="room-card__icon">
                    <img
                      src="https://cleanly-700a6.firebaseapp.com/static/media/double-bed.d9f07817ed485e9e44867d90cd599487.svg"
                      alt="bedroom_icon"
                      width={100}
                    />
                  </div>

                  <strong>BEDROOMS</strong>

                  <div className="room-card__counter">
                    <button
                      type="button"
                      onClick={() => setBedrooms(Math.max(1, bedrooms - 1))}
                    >
                      −
                    </button>

                    <span>{bedrooms}</span>

                    <button
                      type="button"
                      onClick={() => setBedrooms(Math.min(10, bedrooms + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Bathrooms */}
                <div className="room-card">
                  <div className="room-card__icon">
                    <img
                      src="https://cleanly-700a6.firebaseapp.com/static/media/shower.e6890660b15eb68b523fa147e59542bb.svg"
                      alt="bathroom_icon"
                      width={100}
                    />
                  </div>

                  <strong>BATHROOMS</strong>

                  <div className="room-card__counter">
                    <button
                      type="button"
                      onClick={() => setBathrooms(Math.max(1, bathrooms - 1))}
                    >
                      −
                    </button>

                    <span>{bathrooms}</span>

                    <button
                      type="button"
                      onClick={() => setBathrooms(Math.min(10, bathrooms + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Extras */}
              <div className="booking-field booking-extras">
                <p>Need any extras?</p>

                <div className="extra-options">
                  <button
                    type="button"
                    className={extras.oven ? "extra-card active" : "extra-card"}
                    onClick={() => toggleExtra("oven")}
                  >
                    <span className="extra-card__icon">♨</span>
                    <span>CLEAN OVEN</span>
                  </button>

                  <button
                    type="button"
                    className={
                      extras.windows ? "extra-card active" : "extra-card"
                    }
                    onClick={() => toggleExtra("windows")}
                  >
                    <span className="extra-card__icon">▣</span>
                    <span>CLEAN WINDOWS</span>
                  </button>

                  <button
                    type="button"
                    className={
                      extras.fridge ? "extra-card active" : "extra-card"
                    }
                    onClick={() => toggleExtra("fridge")}
                  >
                    <span className="extra-card__icon">▯</span>
                    <span>CLEAN FRIDGE</span>
                  </button>
                </div>
              </div>

              {/* Special Requirements */}
              <div className="booking-field special-requirements">
                <p>
                  Do you have any special requirements? <span>(optional)</span>
                </p>

                <textarea
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                />
              </div>

              <div className="booking-divider"></div>

              {/* Choose Dates */}
              <div className="booking-section-title">
                <h3>Choose dates</h3>
              </div>

              <div className="booking-divider"></div>

              <div className="booking-field">
                <p>Choose a date?</p>

                <input
                  type="date"
                  min={getToday()}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                />
              </div>

              {/* Time */}
              <div className="booking-field">
                <p>When do you like to start?</p>

                <div className="time-options">
                  {[
                    "7:00 AM",
                    "9:00 AM",
                    "11:00 AM",
                    "1:00 PM",
                    "3:00 PM",
                    "5:00 PM",
                    "7:00 PM",
                    "9:00 PM",
                  ].map((time) => (
                    <button
                      type="button"
                      key={time}
                      className={
                        selectedTime === time
                          ? "time-option active"
                          : "time-option"
                      }
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="booking-divider"></div>

              {/* Pay Later */}
              <div className="pay-later">
                <h2>BOOK NOW, PAY LATER</h2>

                <h3>We offer a money back guarantee</h3>

                <p>
                  Pay only after your cleaning is complete and you are satisfied
                  with the service.
                </p>
              </div>

              {/* Personal Details */}
              <div className="personal-details">
                <label>Personal Details</label>

                <input
                  type="text"
                  placeholder="Full Name"
                  value={personalDetails.name}
                  onChange={(e) => updatePersonalDetail("name", e.target.value)}
                  required
                />

                <div className="personal-details__row">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={personalDetails.email}
                    onChange={(e) =>
                      updatePersonalDetail("email", e.target.value)
                    }
                    required
                  />

                  <input
                    type="tel"
                    placeholder="+1 (242) 423-4234"
                    value={personalDetails.phone}
                    maxLength={17}
                    onChange={(e) =>
                      updatePersonalDetail(
                        "phone",
                        formatPhoneNumber(e.target.value),
                      )
                    }
                    required
                  />
                </div>

                <div className="personal-details__row">
                  <input
                    type="text"
                    placeholder="Your Full Address"
                    value={personalDetails.address}
                    onChange={(e) =>
                      updatePersonalDetail("address", e.target.value)
                    }
                    required
                    className="address-input"
                  />

                  <input
                    type="text"
                    placeholder="Zip"
                    className="zip-input"
                    value={personalDetails.zipCode}
                    onChange={(e) =>
                      updatePersonalDetail("zipCode", e.target.value)
                    }
                    required
                  />
                </div>

                <label className="terms">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                  />
                  <span>
                    I read and agree to the{" "}
                    <a href="/">terms &amp; conditions</a>
                  </span>
                </label>

                {error && (
                  <p className="booking-message booking-message--error">
                    {error}
                  </p>
                )}
                {successMessage && (
                  <p className="booking-message booking-message--success">
                    {successMessage}
                  </p>
                )}

                <button
                  type="button"
                  className="complete-booking-btn"
                  onClick={handleBookingSubmit}
                  disabled={submitting || loadingServices}
                >
                  {submitting
                    ? "Submitting..."
                    : loadingServices
                      ? "Loading pricing..."
                      : "🔒 Complete Booking via Secure Server"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <aside className="booking-summary">
          <div className="booking-summary__header">
            <h2>Booking Summary</h2>
          </div>

          <div className="booking-summary__body">
            <div className="summary-item">
              <span>🧹</span>
              <p>
                {cleaningType === "STANDARD"
                  ? "Standard Cleaning"
                  : cleaningType}
              </p>
            </div>

            <div className="summary-item">
              <span>▦</span>
              <p>{formatBookingDate(bookingDate)}</p>
            </div>

            {selectedTime ? (
              <div className="summary-item">
                <span>◷</span>
                <p>{selectedTime}</p>
              </div>
            ) : null}

            {frequency ? (
              <div className="summary-item">
                <span className="summary-icon summary-icon--reload">↻</span>
                <p>
                  {frequency === "ONE-TIME"
                    ? "One-Time"
                    : frequency === "BI-WEEKLY"
                      ? "Bi-Weekly"
                      : frequency.charAt(0) + frequency.slice(1).toLowerCase()}
                </p>
              </div>
            ) : null}

            <div className="summary-total">
              <h3>Total cost</h3>
              <strong>${calculateTotal().toFixed(2)}</strong>
            </div>
          </div>
        </aside>
      </section>

      {bookingConfirmation && (
        <div
          className="booking-modal-overlay"
          onClick={() => setBookingConfirmation(null)}
        >
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="booking-modal__close"
              onClick={() => setBookingConfirmation(null)}
              aria-label="Close booking details"
            >
              &times;
            </button>

            <div className="booking-modal__success">
              <div className="booking-modal__check">✓</div>

              <h2>Booking Confirmed!</h2>

              <p>Your cleaning booking has been created successfully.</p>
            </div>

            <div className="booking-modal__total">
              <span>Total Cost</span>
              <strong>
                ${Number(bookingConfirmation.totalCost || 0).toFixed(2)}
              </strong>
            </div>

            <div className="booking-modal__section">
              <h3>Cleaning Details</h3>

              <div className="booking-modal__grid">
                <div>
                  <span>Cleaning Type</span>
                  <strong>{bookingConfirmation.cleaningType || "-"}</strong>
                </div>

                <div>
                  <span>Frequency</span>
                  <strong>{bookingConfirmation.frequency || "-"}</strong>
                </div>

                <div>
                  <span>Bedrooms</span>
                  <strong>{bookingConfirmation.bedrooms || 0}</strong>
                </div>

                <div>
                  <span>Bathrooms</span>
                  <strong>{bookingConfirmation.bathrooms || 0}</strong>
                </div>

                <div>
                  <span>Date</span>
                  <strong>
                    {formatBookingDate(
                      bookingConfirmation.bookingDate?.slice?.(0, 10) ||
                        bookingDate,
                    )}
                  </strong>
                </div>

                <div>
                  <span>Time</span>
                  <strong>{bookingConfirmation.timeSlot || "-"}</strong>
                </div>
              </div>
            </div>

            <div className="booking-modal__section">
              <h3>Extras</h3>

              {bookingConfirmation.extras?.length > 0 ? (
                <div className="booking-modal__extras">
                  {bookingConfirmation.extras.map((extra) => (
                    <span key={extra}>{extra}</span>
                  ))}
                </div>
              ) : (
                <p className="booking-modal__muted">No extras selected</p>
              )}
            </div>

            <div className="booking-modal__section">
              <h3>Personal Details</h3>

              <div className="booking-modal__personal">
                <div>
                  <span>Name</span>
                  <strong>{bookingConfirmation.customerName || "-"}</strong>
                </div>

                <div>
                  <span>Email</span>
                  <strong>{bookingConfirmation.customerEmail || "-"}</strong>
                </div>

                <div>
                  <span>Phone</span>
                  <strong>{bookingConfirmation.customerPhone || "-"}</strong>
                </div>

                <div>
                  <span>Address</span>
                  <strong>{bookingConfirmation.address || "-"}</strong>
                </div>

                <div>
                  <span>Zip Code</span>
                  <strong>{bookingConfirmation.zipCode || "-"}</strong>
                </div>
              </div>
            </div>

            <div className="booking-modal__section">
              <h3>Special Requirements</h3>

              <p className="booking-modal__special">
                {bookingConfirmation.specialReq ||
                  "No special requirements added."}
              </p>
            </div>

            <div className="booking-modal__footer">
              <span>
                Booking #{String(bookingConfirmation._id || "").slice(-8)}
              </span>

              <button
                type="button"
                onClick={() => setBookingConfirmation(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
