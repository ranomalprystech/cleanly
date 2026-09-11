import { useEffect, useState } from "react";
import { AlertTriangle, CalendarDays, Clock3, DollarSign, LoaderCircle } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import "../styles/components/RecentBookings.scss";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const formatDate = (value) => {
  if (!value) return "Date unavailable";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

const formatLabel = (value) => String(value || "-").replace(/-/g, " ");

const RecentBookings = ({ isLoggedIn = false, handleLogout }) => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reportingId, setReportingId] = useState(null);
  const [reportForm, setReportForm] = useState({ subject: "", description: "" });
  const [reportMessage, setReportMessage] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/auth", { replace: true });
      return undefined;
    }

    const loadBookings = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/bookings/mine`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setBookings(response.data?.bookings || []);
      } catch (loadError) {
        if (loadError.response?.status === 401) {
          navigate("/auth", { replace: true });
          return;
        }
        setError(loadError.response?.data?.message || "Unable to load your bookings.");
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [isLoggedIn, navigate]);

  const openReportForm = (bookingId) => {
    setReportingId(bookingId);
    setReportForm({ subject: "", description: "" });
    setReportMessage("");
  };

  const submitReport = async (event, bookingId) => {
    event.preventDefault();
    setSubmittingReport(true);
    setReportMessage("");

    try {
      await axios.post(`${API_BASE_URL}/bookings/${bookingId}/problems`, reportForm, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setReportMessage("Your report was submitted.");
      setReportForm({ subject: "", description: "" });
    } catch (reportError) {
      setReportMessage(reportError.response?.data?.message || "Unable to submit your report.");
    } finally {
      setSubmittingReport(false);
    }
  };

  return (
    <div className="recent-bookings-page">
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <main className="recent-bookings">
        <header className="recent-bookings__heading">
          <p className="recent-bookings__eyebrow">Your Cleanly account</p>
          <h1>Recent bookings</h1>
          <p>Keep track of your upcoming cleanings and get help with a completed service.</p>
        </header>

        {loading && (
          <div className="recent-bookings__state" role="status">
            <LoaderCircle className="recent-bookings__spinner" size={28} />
            <p>Loading your bookings...</p>
          </div>
        )}

        {!loading && error && <div className="recent-bookings__alert">{error}</div>}

        {!loading && !error && !bookings.length && (
          <section className="recent-bookings__empty">
            <CalendarDays size={34} />
            <h2>No bookings yet</h2>
            <p>Your completed and upcoming cleanings will appear here.</p>
            <button type="button" onClick={() => navigate("/booking")}>Book a cleaning</button>
          </section>
        )}

        {!loading && !error && bookings.length > 0 && (
          <section className="recent-bookings__list" aria-label="Recent bookings">
            {bookings.map((booking) => {
              const bookingId = booking._id || booking.id;
              const isReporting = reportingId === bookingId;

              return (
                <article className="booking-record" key={bookingId}>
                  <div className="booking-record__topline">
                    <div>
                      <p className="booking-record__label">{formatLabel(booking.status)}</p>
                      <h2>{formatLabel(booking.cleaningType)} cleaning</h2>
                    </div>
                    <span className={`booking-record__status booking-record__status--${String(booking.status || "pending").toLowerCase()}`}>
                      {formatLabel(booking.status)}
                    </span>
                  </div>

                  <div className="booking-record__details">
                    <span><CalendarDays size={17} /> {formatDate(booking.bookingDate)}</span>
                    <span><Clock3 size={17} /> {booking.timeSlot || "Time unavailable"}</span>
                    <span><DollarSign size={17} /> {Number(booking.totalCost || 0).toFixed(2)}</span>
                  </div>

                  <div className="booking-record__footer">
                    <span>Booking #{String(bookingId).slice(-8)}</span>
                    <button type="button" className="booking-record__report-button" onClick={() => openReportForm(bookingId)}>
                      <AlertTriangle size={16} /> Report a problem
                    </button>
                  </div>

                  {isReporting && (
                    <form className="problem-form" onSubmit={(event) => submitReport(event, bookingId)}>
                      <div className="problem-form__heading">
                        <h3>Report a problem</h3>
                        <button type="button" onClick={() => setReportingId(null)} aria-label="Close report form">&times;</button>
                      </div>
                      <input
                        type="text"
                        placeholder="Subject"
                        value={reportForm.subject}
                        onChange={(event) => setReportForm({ ...reportForm, subject: event.target.value })}
                        maxLength={120}
                        required
                      />
                      <textarea
                        placeholder="Tell us what happened"
                        value={reportForm.description}
                        onChange={(event) => setReportForm({ ...reportForm, description: event.target.value })}
                        maxLength={2000}
                        rows={4}
                        required
                      />
                      <div className="problem-form__actions">
                        {reportMessage && <p>{reportMessage}</p>}
                        <button type="submit" disabled={submittingReport}>
                          {submittingReport ? "Submitting..." : "Submit report"}
                        </button>
                      </div>
                    </form>
                  )}
                </article>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
};

export default RecentBookings;