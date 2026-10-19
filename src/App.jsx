import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Funds from './pages/Funds';
import FundDetail from './pages/FundDetail';
import Stocks from './pages/Stocks';
import StockDetail from './pages/StockDetail';
import Markets from './pages/Markets';
import Ipo from './pages/Ipo';
import Tools from './pages/Tools';
import Portfolio from './pages/Portfolio';
import Learn from './pages/Learn';
import Stories from './pages/Stories';
import StoryDetail from './pages/StoryDetail';
import Pricing from './pages/Pricing';
import NotFound from './pages/NotFound';
import Account from './pages/Account';
import { Login, Signup, ForgotPassword, ResetPassword, RequireAuth } from './pages/Auth';
import { AuthProvider } from './auth/AuthContext';

/** Scroll to top on route change, or to the #anchor when one is present. */
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

export default function App() {
  return (
    <AuthProvider>
      <ScrollManager />
      <Header />
      <main>
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
      </main>
      <Footer />
    </AuthProvider>
  );
}
