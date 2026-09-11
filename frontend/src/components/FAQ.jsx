import { useState } from "react";
import "../styles/components/FAQ.scss";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What cleaning services do you offer?",
      answer:
        "We offer standard cleaning, deep cleaning, and move-in/move-out cleaning services. You can choose the service that best fits your home's needs.",
    },
    {
      question: "How do I book a cleaning?",
      answer:
        "Simply enter your email address and zip code, select your preferred cleaning service, choose a date and time, and complete your booking.",
    },
    {
      question: "Can I choose the date and time?",
      answer:
        "Yes. You can select your preferred date and available time slot during the booking process.",
    },
    {
      question: "Do I need to provide cleaning supplies?",
      answer:
        "No. Our cleaners come prepared with the necessary cleaning supplies and equipment for your service.",
    },
    {
      question: "Can I request specific cleaning requirements?",
      answer:
        "Absolutely. You can add special requirements or instructions during the booking process so our cleaner knows what is important to you.",
    },
    {
      question: "Can I cancel or reschedule my booking?",
      answer:
        "Yes. You can contact us to request a cancellation or reschedule your cleaning appointment.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq" id="faq">
      <div className="faq__container">
        {/* Heading */}
        <div className="faq__heading">
          <h2>
            Frequently Asked <span>Questions</span>
          </h2>

          <p>
            Everything you need to know about our cleaning services and
            bookings.
          </p>
        </div>

        {/* FAQ List */}
        <div className="faq__list">
          {faqs.map((faq, index) => (
            <div
              className={`faq__item ${
                activeIndex === index ? "faq__item--active" : ""
              }`}
              key={index}
            >
              <button
                className="faq__question"
                onClick={() => toggleFAQ(index)}
                aria-expanded={activeIndex === index}
              >
                <span>{faq.question}</span>

                <span className="faq__icon">
                  {activeIndex === index ? "−" : "+"}
                </span>
              </button>

              <div className="faq__answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;