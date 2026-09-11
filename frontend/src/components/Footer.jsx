import "../styles/components/Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__columns">
          {/* Quick Links */}
          <div className="footer__column">
            <h3>QUICK LINKS</h3>

            <ul>
              <li>
                <a href="#help">Help</a>
              </li>

              <li>
                <a href="#about">About</a>
              </li>

              <li>
                <a href="#press">Press</a>
              </li>

              <li>
                <a href="#blog">Blog</a>
              </li>

              <li>
                <a href="#contact">Contact Us</a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="footer__column">
            <h3>LEGAL STUFF</h3>

            <ul>
              <li>
                <a href="#terms">Terms of use</a>
              </li>

              <li>
                <a href="#cookies">Cookies</a>
              </li>

              <li>
                <a href="#privacy">Privacy Policy</a>
              </li>

              <li>
                <a href="#security">Security Policy</a>
              </li>

              <li>
                <a href="#guarantee">Money back Guarantee</a>
              </li>
            </ul>
          </div>

          {/* Locations */}
          <div className="footer__column">
            <h3>OUR LOCATIONS</h3>

            <ul>
              <li>Boston</li>
              <li>Chicago</li>
              <li>London</li>
              <li>Los Angeles</li>
              <li>New York</li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom"></div>
      </div>
    </footer>
  );
};

export default Footer;
