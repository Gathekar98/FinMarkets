import { useNavigate, useLocation } from 'react-router-dom';
import { useWatchlist } from '../../api/userData';
import { useAuth } from '../../auth/AuthContext';

/** “+ Watchlist” toggle. Sends signed-out visitors to sign in first. */
export default function WatchButton({ kind, refId, name, className = 'btn' }) {
  const { configured } = useAuth();
  const { has, toggle, signedIn } = useWatchlist();
  const navigate = useNavigate();
  const location = useLocation();
  const on = has(kind, refId);
  const click = () => {
    if (!configured || !signedIn) return navigate('/login', { state: { from: location.pathname } });
    toggle(kind, refId, name).catch(() => {});
  };
  return (
    <button className={className} onClick={click} aria-pressed={on}>
      {on ? '★ In watchlist' : '+ Watchlist'}
    </button>
  );
}
