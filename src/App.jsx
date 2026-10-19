import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import useSeo from './seo/useSeo';
import { PAGES } from './seo/meta';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

// Every page except Home is loaded on demand, keeping the first download small.
const Funds = lazy(() => import('./pages/Funds'));
const FundDetail = lazy(() => import('./pages/FundDetail'));
const Stocks = lazy(() => import('./pages/Stocks'));
const StockDetail = lazy(() => import('./pages/StockDetail'));
const Markets = lazy(() => import('./pages/Markets'));
const Ipo = lazy(() => import('./pages/Ipo'));
const Tools = lazy(() => import('./pages/Tools'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Learn = lazy(() => import('./pages/Learn'));
const Stories = lazy(() => import('./pages/Stories'));
const StoryDetail = lazy(() => import('./pages/StoryDetail'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Account = lazy(() => import('./pages/Account'));
const authPage = (name) => lazy(() => import('./pages/Auth').then((m) => ({ default: m[name] })));
const Login = authPage('Login');
const Signup = authPage('Signup');
const ForgotPassword = authPage('ForgotPassword');
const ResetPassword = authPage('ResetPassword');
const RequireAuth = authPage('RequireAuth');
import { AuthProvider } from './auth/AuthContext';

/** Scroll to top on route change, or to the #anchor when one is present. */
/** Titles and descriptions for the fixed pages; detail pages set their own. */
function StaticSeo() {
  useSeo();
  return null;
}

function SeoForRoute() {
  const { pathname } = useLocation();
  return PAGES[pathname] ? <StaticSeo key={pathname} /> : null;
}

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
      return () => clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

/** One-off message passed via navigate(..., { state: { notice } }), e.g. after deleting an account. */
function FlashNotice() {
  const location = useLocation();
  const [text, setText] = useState(null);
  useEffect(() => { if (location.state?.notice) setText(location.state.notice); }, [location.state]);
  if (!text) return null;
  return (
    <div className="flash" role="status">
      <div className="wrap"><span>{text}</span><button className="btn btn-ghost btn-sm" onClick={() => setText(null)} aria-label="Dismiss">✕</button></div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ScrollManager />
      <SeoForRoute />
      <Header />
      <FlashNotice />
      <main>
        <Suspense fallback={<div className="page-loading" aria-busy="true" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/funds" element={<Funds />} />
          <Route path="/funds/:id" element={<FundDetail />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/stocks/:id" element={<StockDetail />} />
          <Route path="/markets" element={<Markets />} />
          <Route path="/ipo" element={<Ipo />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/stories/:id" element={<StoryDetail />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/account" element={<RequireAuth><Account /></RequireAuth>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </main>
      <Footer />
    </AuthProvider>
  );
}
