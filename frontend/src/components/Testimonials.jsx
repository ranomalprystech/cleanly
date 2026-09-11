import "../styles/components/Testimonials.scss";

const Testimonials = () => {
  const testimonials = [
    {
      text: `Maid Services NYC is a wonderful service. I utilized their services to clean a one bedroom apartment I was staying in NYC after throwing a get together. They were prompt, left the place spotless, and very professional.`,
      name: "Sandra",
      role: "Marketing Staff, New York",
    },
    {
      text: `I had them out to help me clean my new place for an office dinner I was having. I was very happy with the results. Jennifer came to the location on time. It is such a treat to have the home professionally cleaned.`,
      name: "Jessica",
      role: "Photographer, New York",
    },
    {
      text: `They did such a good job. Whether you want to give a unique gift or have your own home cleaned, Maid for you provides a large range of top-notch services that I highly recommend to anyone.`,
      name: "Samantha",
      role: "Physical Therapist, Manhattan",
    },
  ];

  return (
    <section className="testimonials">
      <div className="testimonials__container">
        {/* Heading */}
        <div className="testimonials__heading">
          <h2>
            Don't take our <span>word</span>
          </h2>

          <p>
            Read what our past customers said about our cleaning and services.
          </p>
        </div>

        {/* Reviews */}
        <div className="testimonials__grid">
          {testimonials.map((testimonial, index) => (
            <div className="testimonials__item" key={index}>
              <div className="testimonials__card">
                <div className="testimonials__quote">“</div>

                <p>{testimonial.text}</p>
              </div>

              <div className="testimonials__customer">
                <h3>{testimonial.name}</h3>
                <span>{testimonial.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
