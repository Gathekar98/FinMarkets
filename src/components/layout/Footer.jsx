import { Link } from 'react-router-dom';
import Wordmark from '../ui/Wordmark';

const cols = [
  { title: 'Funds', links: [['Fund Screener', '/funds#screener'], ['Top Rated Funds', '/funds?rating=5'], ['Category Monitor', '/funds#categories'], ['New Fund Offers', '/funds#nfo'], ['Tax Saver Funds', '/funds?list=tax']] },
  { title: 'Stocks', links: [['Stock Screener', '/stocks#screener'], ['Gainers & Losers', '/stocks#movers'], ['IPO Monitor', '/ipo'], ['Market Watch', '/markets'], ['Stock Ideas', '/stories?c=Stock Ideas']] },
  { title: 'Tools', links: [['SIP Calculator', '/tools?t=sip'], ['Lumpsum Calculator', '/tools?t=lumpsum'], ['Goal Planner', '/tools?t=goal'], ['Retirement Planner', '/tools?t=retire'], ['Portfolio Tracker', '/portfolio']] },
  { title: 'Learn', links: [['Get Started', '/learn#start'], ['Stories', '/stories'], ['Free Guides', '/learn#guides'], ['Podcast', '/learn#podcast'], ['Glossary', '/learn#glossary']] },
  { title: 'Company', links: [['About us', '/'], ['Subscriptions', '/pricing'], ['Careers', '/'], ['Contact', '/'], ['Privacy & Terms', '/']] },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="logo" aria-label="finMarkets home"><Wordmark onDark size={28} /></Link>
            <p>Independent research, honest ratings and simple tools to help Indian families invest with confidence.</p>
            <form className="footer-news" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="news" className="visually-hidden">Email address</label>
              <input id="news" type="email" placeholder="Your email for the weekly letter" />
              <button className="btn btn-accent btn-sm" type="submit">Subscribe</button>
            </form>
          </div>
          {cols.map((c) => (
            <div key={c.title} className="footer-col">
              <h4>{c.title}</h4>
              {c.links.map(([label, to]) => <Link key={label} to={to}>{label}</Link>)}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <p>
            <strong>Data sources:</strong> mutual fund NAVs from AMFI (updated each evening); stock and index prices are delayed by up to 15 minutes. Ratings and scores are our own calculations and are not investment advice. Mutual fund investments are subject to market risks; read all scheme-related documents carefully.
          </p>
          <p>© 2026 finMarkets. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
