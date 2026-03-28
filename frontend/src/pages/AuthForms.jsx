import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/authForms.css';

/**
 * Animated dual-panel login / register UI (adapted from animated-login-register template).
 * `/login` shows login panel; `/register` shows register panel (same component, URL-driven).
 */
export default function AuthForms() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const isRegister = location.pathname === '/register';

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' });
  const [loginMsg, setLoginMsg] = useState({ type: '', text: '' });
  const [registerMsg, setRegisterMsg] = useState({ type: '', text: '' });
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  const containerClass = useMemo(
    () => `auth-forms-container${isRegister ? ' active' : ''}`,
    [isRegister]
  );

  useEffect(() => {
    if (isRegister) {
      setLoginMsg({ type: '', text: '' });
      setLoginLoading(false);
    } else {
      setRegisterMsg({ type: '', text: '' });
      setRegisterLoading(false);
    }
  }, [isRegister]);

  async function onLoginSubmit(e) {
    e.preventDefault();
    setLoginMsg({ type: '', text: '' });
    setLoginLoading(true);
    try {
      await login({ email: loginForm.email, password: loginForm.password });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const text = err.response?.data?.message || err.message || 'Login failed';
      setLoginMsg({ type: 'error', text });
    } finally {
      setLoginLoading(false);
    }
  }

  async function onRegisterSubmit(e) {
    e.preventDefault();
    setRegisterMsg({ type: '', text: '' });
    setRegisterLoading(true);
    try {
      await register(registerForm);
      setRegisterMsg({ type: 'success', text: 'Account created. Redirecting…' });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const text =
        err.response?.data?.message || err.message || 'Registration failed';
      setRegisterMsg({ type: 'error', text });
    } finally {
      setRegisterLoading(false);
    }
  }

  return (
    <div className="auth-forms-page">
      <div className={containerClass}>
        {/* In-flow height so the box grows; absolute children alone collapse parent height */}
        <div className="auth-forms-size-bridge" aria-hidden="true" />
        <div className="curved-shape" aria-hidden />
        <div className="curved-shape2" aria-hidden />

        {/* Login column */}
        <div className="form-box Login">
          <h2 className="animation" style={{ '--D': 0, '--S': 21 }}>
            Login
          </h2>
          <form onSubmit={onLoginSubmit} noValidate>
            <div className="input-box animation" style={{ '--D': 1, '--S': 22 }}>
              <input
                type="email"
                id="login-email"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm((f) => ({ ...f, email: e.target.value }))
                }
                required
                autoComplete="email"
              />
              <label htmlFor="login-email">Email</label>
              <i className="bx bxs-envelope auth-input-icon" aria-hidden />
            </div>
            <div className="input-box animation" style={{ '--D': 2, '--S': 23 }}>
              <input
                type="password"
                id="login-password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm((f) => ({ ...f, password: e.target.value }))
                }
                required
                autoComplete="current-password"
              />
              <label htmlFor="login-password">Password</label>
              <i className="bx bxs-lock-alt auth-input-icon" aria-hidden />
            </div>
            {loginMsg.text && (
              <div
                className={`auth-form-banner animation ${loginMsg.type}`}
                style={{ '--D': 3, '--S': 24 }}
              >
                {loginMsg.text}
              </div>
            )}
            <div className="input-box animation" style={{ '--D': 3, '--S': 24 }}>
              <button className="btn" type="submit" disabled={loginLoading}>
                {loginLoading ? 'Signing in…' : 'Login'}
              </button>
            </div>
            <div className="regi-link animation" style={{ '--D': 4, '--S': 25 }}>
              <p>
                Don&apos;t have an account? <br />
                <Link to="/register" className="SignUpLink">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>

        <div className="info-content Login">
          <h2 className="animation" style={{ '--D': 0, '--S': 20 }}>
            WELCOME BACK!
          </h2>
          <p className="animation" style={{ '--D': 1, '--S': 21 }}>
            We are happy to have you with us again. If you need anything, we are here to help.
          </p>
        </div>

        {/* Register column */}
        <div className="form-box Register">
          <h2 className="animation" style={{ '--li': 17, '--S': 0 }}>
            Register
          </h2>
          <form onSubmit={onRegisterSubmit} noValidate>
            <p className="animation auth-role-hint" style={{ '--li': 17, '--S': 0 }}>
              New accounts use the USER role.
            </p>
            <div className="input-box animation" style={{ '--li': 18, '--S': 1 }}>
              <input
                type="text"
                id="reg-name"
                value={registerForm.name}
                onChange={(e) =>
                  setRegisterForm((f) => ({ ...f, name: e.target.value }))
                }
                required
                autoComplete="name"
              />
              <label htmlFor="reg-name">Name</label>
              <i className="bx bxs-user auth-input-icon" aria-hidden />
            </div>
            <div className="input-box animation" style={{ '--li': 19, '--S': 2 }}>
              <input
                type="email"
                id="reg-email"
                value={registerForm.email}
                onChange={(e) =>
                  setRegisterForm((f) => ({ ...f, email: e.target.value }))
                }
                required
                autoComplete="email"
              />
              <label htmlFor="reg-email">Email</label>
              <i className="bx bxs-envelope auth-input-icon" aria-hidden />
            </div>
            <div className="input-box animation" style={{ '--li': 19, '--S': 3 }}>
              <input
                type="password"
                id="reg-password"
                value={registerForm.password}
                onChange={(e) =>
                  setRegisterForm((f) => ({ ...f, password: e.target.value }))
                }
                required
                minLength={8}
                autoComplete="new-password"
              />
              <label htmlFor="reg-password">Password</label>
              <i className="bx bxs-lock-alt auth-input-icon" aria-hidden />
            </div>
            {registerMsg.text && (
              <div
                className={`auth-form-banner animation ${registerMsg.type}`}
                style={{ '--li': 20, '--S': 4 }}
              >
                {registerMsg.text}
              </div>
            )}
            <div className="input-box animation" style={{ '--li': 20, '--S': 4 }}>
              <button className="btn" type="submit" disabled={registerLoading}>
                {registerLoading ? 'Creating…' : 'Register'}
              </button>
            </div>
            <div className="regi-link animation" style={{ '--li': 21, '--S': 5 }}>
              <p>
                Already have an account? <br />
                <Link to="/login" className="SignInLink">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>

        <div className="info-content Register">
          <h2 className="animation" style={{ '--li': 17, '--S': 0 }}>
            WELCOME!
          </h2>
          <p className="animation" style={{ '--li': 18, '--S': 1 }}>
            We&apos;re delighted to have you here. If you need any assistance, feel free to reach out.
          </p>
        </div>
      </div>
    </div>
  );
}
