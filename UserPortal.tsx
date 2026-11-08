import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/Navbar';
import { BottomNav } from '../components/BottomNav';
import { WalletCard } from '../components/WalletCard';
import { CategoriesBar } from '../components/CategoriesBar';
import { ServiceCard } from '../components/ServiceCard';
import { DepositModal } from '../components/DepositModal';
import { OrderModal } from '../components/OrderModal';
import { AuthModal } from '../components/AuthModal';
import { OrdersAndWalletView } from '../components/OrdersAndWalletView';
import { ServiceItem } from '../types';
import { 
  Search, 
  X, 
  Zap, 
  ShieldCheck, 
  Headphones, 
  CheckCircle2, 
  Sparkles,
  RotateCcw,
  Layers,
  Send,
  MessageCircle,
  PhoneCall
} from 'lucide-react';

export default function UserPortal() {
  const { 
    services, 
    activeTab, 
    setActiveTab, 
    toast, 
    currentUser,
    siteSettings
  } = useApp();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal states
  const [depositOpen, setDepositOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedServiceForOrder, setSelectedServiceForOrder] = useState<ServiceItem | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const handleOpenDeposit = () => {
    if (!currentUser) {
      handleOpenAuth('login');
      return;
    }
    setDepositOpen(true);
  };

  const handleOrderClick = (service: ServiceItem) => {
    if (!currentUser) {
      handleOpenAuth('login');
      return;
    }
    setSelectedServiceForOrder(service);
  };

  const handleFocusSearch = () => {
    setActiveTab('home');
    setTimeout(() => {
      searchInputRef.current?.focus();
      searchInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  // Filtered Services
  const filteredServices = services.filter((s) => {
    if (s.status !== 'active') return false;
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-20 lg:pb-10 selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2 animate-in fade-in slide-in-from-top-4 border border-slate-700">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        onOpenAuth={handleOpenAuth}
        onOpenDeposit={handleOpenDeposit}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8 flex-1 w-full space-y-8">
        {/* VIEW 1: HOME */}
        {activeTab === 'home' && (
          <>
            {/* Wallet Balance Hero Card */}
            <WalletCard
              onOpenDeposit={handleOpenDeposit}
              onOpenAuth={() => handleOpenAuth('login')}
            />

            {/* Global Search Bar */}
            <div className="relative">
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-2 flex items-center gap-3 transition-focus-within focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100">
                <Search className="w-5 h-5 text-slate-400 ml-2" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="সার্চ করুন (সার্ভিসের নাম, ক্যাটাগরি বা বিবরণ, যেমন: Facebook, YouTube, Speed)..."
                  className="w-full text-sm font-semibold text-slate-900 bg-transparent border-none outline-none placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition mr-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Categories Grid Bar */}
            <CategoriesBar
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
            />

            {/* Services Grid Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                    <h2 className="text-lg font-bold text-slate-900">
                      {selectedCategory === 'all' ? 'জনপ্রিয় সার্ভিস সমূহ' : `${selectedCategory} সার্ভিস`}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {filteredServices.length} টি সার্ভিস পাওয়া গেছে
                  </p>
                </div>

                {selectedCategory !== 'all' && (
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    সকল সার্ভিস দেখুন
                  </button>
                )}
              </div>

              {filteredServices.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                  <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="font-bold text-slate-700">কোনো সার্ভিস পাওয়া যায়নি</p>
                  <p className="text-xs text-slate-400 mt-1">ভিন্ন শব্দ লিখে সার্চ করুন বা ক্যাটাগরি পরিবর্তন করুন।</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onOrderClick={handleOrderClick}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Why Choose FAST SERVICE BD? */}
            <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  কেন FAST SERVICE BD?
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  দ্রুত • নিরাপদ • শতভাগ নির্ভরযোগ্য
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  আমরা ডিজিটাল সার্ভিসের মান ও গ্রাহক সন্তুষ্টিকে সর্বোচ্চ প্রাধান্য দিই।
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-base">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>দ্রুত সার্ভিস</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    অর্ডার প্লেস করার পর দ্রুততম সময়ে স্বয়ংক্রিয়ভাবে কাজ প্রক্রিয়া শুরু হয়।
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-base">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>নিরাপদ লেনদেন</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    বিকাশ, নগদ ও রকেটের মাধ্যমে নিরাপদ ডিপোজিট এবং সুরক্ষিত ওয়ালেট ভল্ট।
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-base">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>সেরা সাপোর্ট</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    অর্ডার সংক্রান্ত যেকোনো প্রশ্ন বা সমস্যায় ২৪/৭ দ্রুত প্রতিক্রিয়া পাবেন।
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-base">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>নির্ভরযোগ্য রিফান্ড</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    অর্ডার কোনো কারণে বাতিল হলে ওয়ালেটে ১০০% টাকা ইনস্ট্যান্ট ফেরত চলে আসে।
                  </p>
                </div>
              </div>

              {/* Dedicated Royal Telegram Helpline Callout */}
              <div className="mt-8 rounded-3xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
                  <div className="w-16 h-16 rounded-2xl bg-white text-sky-600 flex items-center justify-center font-black shadow-lg shrink-0">
                    <Send className="w-8 h-8 fill-sky-600 text-sky-600 -translate-x-0.5 translate-y-0.5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full text-white inline-block mb-1.5 backdrop-blur-xs">
                      জরুরি টেলিগ্রাম সাপোর্ট
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      যেকোনো সমস্যায় সরাসরি টেলিগ্রামে কথা বলুন
                    </h3>
                    <p className="text-xs sm:text-sm text-sky-100 mt-1 max-w-xl">
                      ডিপোজিট, ব্যালেন্স অ্যাড, অর্ডার অগ্রগতি বা স্পেশাল কাস্টম সার্ভিসের জন্য আমাদের অফিশিয়াল টেলিগ্রাম হেল্পলাইনে যোগাযোগ করুন।
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
                  <a
                    href={`https://t.me/${siteSettings.telegramUsername || 'FastServiceBD_Official'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto bg-white hover:bg-sky-50 text-sky-700 font-extrabold px-6 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 text-sm"
                  >
                    <Send className="w-4 h-4 fill-sky-600 text-sky-600" />
                    <span>টেলিগ্রাম মেসেজ পাঠান</span>
                  </a>

                  {siteSettings.supportPhone && (
                    <a
                      href={`tel:${siteSettings.supportPhone}`}
                      className="w-full sm:w-auto bg-sky-500/20 hover:bg-sky-500/30 text-white border border-white/20 font-bold px-4 py-3 rounded-2xl transition flex items-center justify-center gap-1.5 text-xs backdrop-blur-xs"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{siteSettings.supportPhone}</span>
                    </a>
                  )}
                </div>
              </div>
            </section>
          </>
        )}

        {/* VIEW 2: ORDERS */}
        {activeTab === 'orders' && (
          <OrdersAndWalletView initialTab="orders" />
        )}

        {/* VIEW 3: WALLET */}
        {activeTab === 'wallet' && (
          <OrdersAndWalletView initialTab="wallet" />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 FAST SERVICE BD — Fast • Safe • Reliable. সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-4 text-slate-600 font-semibold">
            <span>bKash</span>
            <span>Nagad</span>
            <span>Rocket</span>
            <span className="text-slate-300">|</span>
            <Link
              to="/admin"
              className="text-slate-400 hover:text-slate-600 transition"
              title="ম্যানেজমেন্ট এক্সেস"
            >
              Staff Portal (/admin)
            </Link>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        onOpenSearch={handleFocusSearch}
        onOpenDeposit={handleOpenDeposit}
        onOpenAuth={() => handleOpenAuth('login')}
      />

      {/* Modals */}
      <DepositModal
        isOpen={depositOpen}
        onClose={() => setDepositOpen(false)}
      />

      <OrderModal
        service={selectedServiceForOrder}
        isOpen={!!selectedServiceForOrder}
        onClose={() => setSelectedServiceForOrder(null)}
        onOpenDeposit={handleOpenDeposit}
        onOpenAuth={() => handleOpenAuth('login')}
      />

      <AuthModal
        isOpen={authOpen}
        initialMode={authMode}
        onClose={() => setAuthOpen(false)}
      />

      {/* Floating Telegram Support Quick Action */}
      <aside aria-label="Support Floating Action">
        <a
          href={`https://t.me/${siteSettings.telegramUsername || 'FastServiceBD_Official'}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-20 right-4 sm:bottom-8 sm:right-8 z-40 bg-sky-500 hover:bg-sky-400 text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-2xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95 group border-2 border-white/80"
          title="সরাসরি টেলিগ্রামে যোগাযোগ করুন"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
          <Send className="w-5 h-5 fill-white text-white -translate-x-0.5" />
          <span className="hidden sm:inline font-bold text-xs tracking-wide">
            জরুরি টেলিগ্রাম
          </span>
        </a>
      </aside>
    </div>
  );
}
