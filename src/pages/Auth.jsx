import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

function Shell({ children, side = 'signin' }) {
  return (
    <section className="auth-wrap">
      <aside className="auth-side">
        <span className="eyebrow" style={{ color: 'var(--accent)' }}>{side === 'signup' ? 'Free forever' : 'Welcome back'}</span>
        <h2>{side === 'signup' ? 'Your money, finally in one clear view.' : 'Pick up right where you left off.'}</h2>
        <ul>
          <li>Track every fund, stock, FD and gold holding at live prices</li>
          <li>Watchlists with prices that update through the trading day</li>
          <li>Ratings and scores on everything you own</li>
          <li>No spam, no commissions, no selling your data</li>
        </ul>
      </aside>
      <div className="auth-main"><div className="auth-card">{children}</div></div>
    </section>
  );
}

function NotConfigured() {
  return (
    <div className="note">
      Sign-in is not switched on yet. The site owner needs to add the Supabase keys to <code>.env.local</code> and restart the server.
    </div>
  );
}

function GoogleButton() {
  const { signInWithGoogle } = useAuth();
  const [err, setErr] = useState('');
  return (
    <>
      <button type="button" className="btn btn-block" onClick={() => signInWithGoogle().catch((e) => setErr(e.message))}>
        <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" /><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" /><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" /><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" /></svg>
        Continue with Google
      </button>
      {err && <div className="form-msg err">{err}</div>}
    </>
  );
}

const Field = ({ id, label, ...props }) => (
  <div className="field">
    <label htmlFor={id}>{label}</label>
    <input id={id} className="input" {...props} />
  </div>
);

export function Login() {
  const { signIn, user, configured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const from = useLocation().state?.from || '/portfolio';
  if (user) return <Navigate to={from} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      await signIn(email.trim(), password);
      navigate(from, { replace: true });
    } catch (ex) { setErr(ex.message); } finally { setBusy(false); }
  };

  return (
    <Shell>
      <h1>Sign in</h1>
      <p className="muted">New here? <Link to="/signup" className="link-arrow">Create a free account</Link></p>
      {!configured && <NotConfigured />}
      <GoogleButton />
      <div className="auth-or">or with email</div>
      <form onSubmit={submit}>
        <Field id="li-email" label="Email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Field id="li-pass" label="Password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <div style={{ textAlign: 'right', marginTop: -6 }}><Link to="/forgot-password" className="small" style={{ color: 'var(--brand)' }}>Forgot password?</Link></div>
        {err && <div className="form-msg err" role="alert">{err}</div>}
        <button className="btn btn-primary btn-block" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </Shell>
  );
}

export function Signup() {
  const { signUp, user, configured } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  if (user && !done) return <Navigate to="/portfolio" replace />;
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (form.password.length < 8) return setErr('Password must be at least 8 characters.');
    if (form.password !== form.confirm) return setErr('Passwords do not match.');
    setBusy(true);
    try {
      const data = await signUp(form.email.trim(), form.password, form.name.trim());
      if (data.session) navigate('/portfolio', { replace: true }); // email confirmation disabled
      else setDone(true);
    } catch (ex) { setErr(ex.message); } finally { setBusy(false); }
  };

  if (done) {
    return (
      <Shell side="signup">
        <h1>Check your inbox</h1>
        <p>We sent a confirmation link to <strong>{form.email}</strong>. Click it to activate your account, then sign in.</p>
        <Link to="/login" className="btn btn-primary">Go to sign in</Link>
      </Shell>
    );
  }

  return (
    <Shell side="signup">
      <h1>Create your account</h1>
      <p className="muted">Already have one? <Link to="/login" className="link-arrow">Sign in</Link></p>
      {!configured && <NotConfigured />}
      <GoogleButton />
      <div className="auth-or">or with email</div>
      <form onSubmit={submit}>
        <Field id="su-name" label="Full name" autoComplete="name" required value={form.name} onChange={set('name')} />
        <Field id="su-email" label="Email" type="email" autoComplete="email" required value={form.email} onChange={set('email')} />
        <Field id="su-pass" label="Password (min. 8 characters)" type="password" autoComplete="new-password" required minLength={8} value={form.password} onChange={set('password')} />
        <Field id="su-confirm" label="Confirm password" type="password" autoComplete="new-password" required value={form.confirm} onChange={set('confirm')} />
        {err && <div className="form-msg err" role="alert">{err}</div>}
        <button className="btn btn-primary btn-block" disabled={busy}>{busy ? 'Creating account…' : 'Create free account'}</button>
        <p className="xs muted">By signing up you agree to our Terms and Privacy Policy.</p>
      </form>
    </Shell>
  );
}

export function ForgotPassword() {
  const { sendReset, configured } = useAuth();
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await sendReset(email.trim());
      setMsg({ ok: true, text: `If an account exists for ${email}, a reset link is on its way.` });
    } catch (ex) { setMsg({ ok: false, text: ex.message }); } finally { setBusy(false); }
  };
  return (
    <Shell>
      <h1>Reset password</h1>
      <p className="muted">Enter your email and we'll send you a link to choose a new password.</p>
      {!configured && <NotConfigured />}
      <form onSubmit={submit}>
        <Field id="fp-email" label="Email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        {msg && <div className={`form-msg ${msg.ok ? 'ok' : 'err'}`} role="status">{msg.text}</div>}
        <button className="btn btn-primary btn-block" disabled={busy}>{busy ? 'Sending…' : 'Send reset link'}</button>
      </form>
      <Link to="/login" className="small">← Back to sign in</Link>
    </Shell>
  );
}

export function ResetPassword() {
  const { updatePassword, session, loading } = useAuth();
  const [pw, setPw] = useState('');
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    if (pw.length < 8) return setMsg({ ok: false, text: 'Password must be at least 8 characters.' });
    try {
      await updatePassword(pw);
      setMsg({ ok: true, text: 'Password updated. Taking you to your account…' });
      setTimeout(() => navigate('/account'), 1200);
    } catch (ex) { setMsg({ ok: false, text: ex.message }); }
  };
  return (
    <Shell>
      <h1>Choose a new password</h1>
      {!loading && !session && <div className="form-msg err">This reset link is invalid or has expired. <Link to="/forgot-password">Request a new one</Link>.</div>}
      <form onSubmit={submit}>
        <Field id="rp-pass" label="New password" type="password" autoComplete="new-password" required minLength={8} value={pw} onChange={(e) => setPw(e.target.value)} />
        {msg && <div className={`form-msg ${msg.ok ? 'ok' : 'err'}`}>{msg.text}</div>}
        <button className="btn btn-primary btn-block" disabled={!session}>Update password</button>
      </form>
    </Shell>
  );
}

/** Redirects to /login (and back afterwards) when signed out. */
export function RequireAuth({ children }) {
  const { user, loading, configured } = useAuth();
  const location = useLocation();
  const [ready, setReady] = useState(!loading);
  useEffect(() => { if (!loading) setReady(true); }, [loading]);
  if (!configured) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (!ready) return <div className="section"><div className="wrap empty">Loading your account…</div></div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname + location.hash }} />;
  return children;
}
