import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PhoneCall } from 'lucide-react';
import axios from 'axios';
import '../styles/components/Auth.scss';

const Auth = ({ setIsLoggedIn, setCurrentUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/auth/login' : '/auth/register';

    try {
      const response = await axios.post(
        `${API_BASE_URL}${endpoint}`,
        formData
      );

      const data = response.data;

      if (isLogin) {
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        setIsLoggedIn?.(true);
        setCurrentUser?.(data.user);

        navigate('/');
      } else {
        alert('Account created successfully! Please sign in.');
        setIsLogin(true);
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Something went wrong. Please try again.';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <header className="auth-header">
        <Link to="/" className="auth-logo-link">
          <img
            src="https://cleanly-700a6.firebaseapp.com/static/media/logo.8ff229fcc20562bae2d7.png"
            alt="Cleanly"
          />
        </Link>

        <a
          className="whatsapp-link"
          href="https://wa.me/18007108420"
          target="_blank"
          rel="noreferrer"
          aria-label="Contact Cleanly on WhatsApp"
          title="Contact us on WhatsApp"
        >
          <PhoneCall
            size={22}
            strokeWidth={2.2}
            aria-hidden="true"
          />
        </a>
      </header>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-tabs">
            <button
              type="button"
              className={`tab-btn ${isLogin ? 'active' : ''}`}
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
            >
              Login
            </button>

            <button
              type="button"
              className={`tab-btn ${!isLogin ? 'active' : ''}`}
              onClick={() => {
                setIsLogin(false);
                setError('');
              }}
            >
              Sign Up
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading
                ? 'Processing...'
                : isLogin
                ? 'Sign In'
                : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
