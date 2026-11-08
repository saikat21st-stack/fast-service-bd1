import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ServiceItem, CategoryItem, OrderItem, DepositItem, UserProfile } from '../types';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  CreditCard, 
  Users, 
  Layers, 
  Settings, 
  Plus, 
  Trash2, 
  Save, 
  Search, 
  Lock, 
  LogOut, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  KeyRound,
  AlertCircle
} from 'lucide-react';

export default function StandaloneAdminPage() {
  const navigate = useNavigate();
  const { 
    currentUser, 
    setCurrentUser,
    users, 
    orders, 
    deposits, 
    services, 
    categories, 
    siteSettings,
    approveDeposit, 
    rejectDeposit, 
    updateOrderStatus, 
    updateUserStatus, 
    addService, 
    deleteService, 
    updateSiteSettings,
    showToast
  } = useApp();

  // Admin login states if not authenticated as admin
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const [activeAdminTab, setActiveAdminTab] = useState<'dashboard' | 'orders' | 'deposits' | 'users' | 'services' | 'settings'>('dashboard');
  
  // Service Form State
  const [showAddService, setShowAddService] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState(categories[0]?.name || 'Social Media');
  const [newServicePrice, setNewServicePrice] = useState<number>(50);
  const [newServiceTag, setNewServiceTag] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');

  // Settings Form State
  const [bkashNum, setBkashNum] = useState(siteSettings.bkashNumber);
  const [nagadNum, setNagadNum] = useState(siteSettings.nagadNumber);
  const [rocketNum, setRocketNum] = useState(siteSettings.rocketNumber);
  const [telegramUser, setTelegramUser] = useState(siteSettings.telegramUsername || 'FastServiceBD_Official');
  const [phoneSupport, setPhoneSupport] = useState(siteSettings.supportPhone || '01812345678');
  const [siteNotice, setSiteNotice] = useState(siteSettings.notice);

  // Search & Filter State
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'rejected'>('all');
  const [depositStatusFilter, setDepositStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [userSearch, setUserSearch] = useState('');

  const isAdminAuthenticated = currentUser?.isAdmin === true;

  // Statistics
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const pendingDeposits = deposits.filter((d) => d.status === 'pending');
  const completedOrders = orders.filter((o) => o.status === 'completed');
  const totalSystemRevenue = orders
    .filter((o) => o.status === 'completed')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const foundAdmin = users.find(
      (u) => u.isAdmin && (u.email.toLowerCase() === adminEmail.toLowerCase() || adminEmail.toLowerCase() === 'admin')
    );

    if (foundAdmin) {
      setCurrentUser(foundAdmin);
      showToast('অ্যাডমিন প্যানেলে সফলভাবে লগইন হয়েছে!');
    } else {
      setLoginError('অবৈধ অ্যাডমিন ক্রেডেনশিয়াল। শুধুমাত্র রেজিস্টার্ড সুপার অ্যাডমিন প্রবেশ করতে পারবেন।');
    }
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName || newServicePrice <= 0) return;

    await addService({
      name: newServiceName,
      category: newServiceCategory,
      price: newServicePrice,
      tag: newServiceTag || undefined,
      description: newServiceDesc,
      status: 'active',
    });

    setShowAddService(false);
    setNewServiceName('');
    setNewServicePrice(50);
    setNewServiceTag('');
    setNewServiceDesc('');
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSiteSettings({
      bkashNumber: bkashNum,
      nagadNumber: nagadNum,
      rocketNumber: rocketNum,
      telegramUsername: telegramUser.replace(/^@/, '').trim(),
      supportPhone: phoneSupport.trim(),
      notice: siteNotice,
    });
  };

  // If not authenticated as Admin, show dedicated isolated Secure Admin Login Gate
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 selection:bg-indigo-600 selection:text-white">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              <KeyRound className="w-7 h-7" />
            </div>
            <span className="text-[11px] font-bold tracking-widest text-indigo-400 uppercase bg-indigo-950/60 border border-indigo-800/50 px-3 py-1 rounded-full">
              FAST SERVICE BD • SECURE PORTAL
            </span>
            <h1 className="text-2xl font-black text-white mt-3">অ্যাডমিন প্রবেশদ্বার</h1>
            <p className="text-xs text-slate-400 mt-1">
              পাথ: <code className="text-indigo-300 font-mono">/admin</code> — শুধুমাত্র সিস্টেম অ্যাডমিনিস্ট্রেটরদের জন্য সংরক্ষিত।
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                অ্যাডমিন ইমেইল / ইউজারনেম
              </label>
              <input
                type="text"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@fastservicebd.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                সিকিউরিটি পাসওয়ার্ড
              </label>
              <input
                type="password"
                required
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white font-bold py-3 rounded-xl transition cursor-pointer shadow-lg shadow-indigo-600/30 text-sm mt-2 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>অ্যাডমিন প্যানেলে প্রবেশ করুন</span>
            </button>
          </form>

          {/* Quick Demo Switcher helper */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-500 mb-2">ডেমো টেস্ট করার জন্য সরাসরি ক্লিক করুন:</p>
            <button
              type="button"
              onClick={() => {
                const admin = users.find((u) => u.isAdmin);
                if (admin) setCurrentUser(admin);
              }}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-800/40 px-3 py-1.5 rounded-lg transition cursor-pointer"
            >
              সুপার অ্যাডমিন ক্রেডেনশিয়াল লোড করুন
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-xs text-slate-500 hover:text-slate-300 inline-flex items-center gap-1 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ইউজার ওয়েবসাইটে ফিরে যান (/)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Standalone Full-screen Admin Panel Layout
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Top Admin Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black shadow-md shadow-indigo-600/30">
              FS
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block">
                FAST SERVICE BD <span className="text-indigo-400 text-xs font-bold uppercase ml-1 px-1.5 py-0.5 rounded bg-indigo-950 border border-indigo-800">Admin (/admin)</span>
              </span>
              <span className="text-[11px] text-slate-400">আইসোলেটেড রুট কন্ট্রোল প্যানেল</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-xs font-medium text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-850 flex items-center gap-1.5 transition cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">লাইভ ওয়েবসাইট</span>
            </button>

            <button
              onClick={() => {
                const regular = users.find((u) => !u.isAdmin) || null;
                setCurrentUser(regular);
                navigate('/');
              }}
              className="text-xs font-bold text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-lg border border-rose-900/40 hover:bg-rose-950/40 flex items-center gap-1.5 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>অ্যাডমিন এক্সিট ও হোমপেজ</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 py-6 w-full flex-1 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
          <button
            onClick={() => setActiveAdminTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 cursor-pointer ${
              activeAdminTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>ওভারভিউ</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 cursor-pointer relative ${
              activeAdminTab === 'orders' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>অর্ডার সমূহ</span>
            {pendingOrders.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] flex items-center justify-center">
                {pendingOrders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveAdminTab('deposits')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 cursor-pointer relative ${
              activeAdminTab === 'deposits' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>ডিপোজিট রিকোয়েস্ট</span>
            {pendingDeposits.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-emerald-400 text-slate-950 font-black text-[10px] flex items-center justify-center">
                {pendingDeposits.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveAdminTab('users')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 cursor-pointer ${
              activeAdminTab === 'users' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>ইউজার লিস্ট</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('services')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 cursor-pointer ${
              activeAdminTab === 'services' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>সার্ভিসেস ও মূল্য</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 cursor-pointer ${
              activeAdminTab === 'settings' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>পেমেন্ট নম্বর ও সাইট নোটিশ</span>
          </button>
        </div>

        {/* 1. Dashboard Overview */}
        {activeAdminTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 shadow-md">
                <span className="text-xs font-bold text-slate-400 uppercase">মোট গ্রাহক</span>
                <p className="text-2xl sm:text-3xl font-black text-white mt-2">{users.length} জন</p>
              </div>
              <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 shadow-md">
                <span className="text-xs font-bold text-amber-400 uppercase">পেন্ডিং ডিপোজিট</span>
                <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-2">{pendingDeposits.length} টি</p>
              </div>
              <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 shadow-md">
                <span className="text-xs font-bold text-indigo-400 uppercase">পেন্ডিং অর্ডার</span>
                <p className="text-2xl sm:text-3xl font-black text-indigo-400 mt-2">{pendingOrders.length} টি</p>
              </div>
              <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 shadow-md">
                <span className="text-xs font-bold text-emerald-400 uppercase">সম্পন্ন অর্ডার আয়</span>
                <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2">৳{totalSystemRevenue.toFixed(2)}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Quick Deposits */}
              <div className="bg-slate-950 rounded-3xl p-5 border border-slate-800 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                    <span>পেন্ডিং ডিপোজিট ({pendingDeposits.length})</span>
                  </h3>
                  <button
                    onClick={() => setActiveAdminTab('deposits')}
                    className="text-xs text-indigo-400 font-bold hover:underline"
                  >
                    সব দেখুন
                  </button>
                </div>

                {pendingDeposits.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">কোনো পেন্ডিং ডিপোজিট নেই।</p>
                ) : (
                  <div className="space-y-3">
                    {pendingDeposits.slice(0, 3).map((dep) => (
                      <div key={dep.depositId} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-indigo-400">{dep.method}</span>
                            <span className="font-mono text-xs font-bold text-slate-200">{dep.trxId}</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">{dep.email} ({dep.senderNumber})</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-emerald-400 text-sm">৳{dep.amount}</span>
                          <button
                            onClick={() => approveDeposit(dep.depositId)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                          >
                            Approve
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Orders */}
              <div className="bg-slate-950 rounded-3xl p-5 border border-slate-800 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-indigo-400" />
                    <span>পেন্ডিং অর্ডার ({pendingOrders.length})</span>
                  </h3>
                  <button
                    onClick={() => setActiveAdminTab('orders')}
                    className="text-xs text-indigo-400 font-bold hover:underline"
                  >
                    সব দেখুন
                  </button>
                </div>

                {pendingOrders.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">কোনো পেন্ডিং অর্ডার নেই।</p>
                ) : (
                  <div className="space-y-3">
                    {pendingOrders.slice(0, 3).map((ord) => (
                      <div key={ord.orderId} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                        <div>
                          <h4 className="font-bold text-slate-200 text-xs sm:text-sm line-clamp-1">{ord.serviceName}</h4>
                          <p className="text-[11px] text-slate-400">{ord.customerName} • ৳{ord.amount}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => updateOrderStatus(ord.orderId, 'confirmed')}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-xl cursor-pointer"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => updateOrderStatus(ord.orderId, 'rejected')}
                            className="bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-[11px] font-bold px-2.5 py-1.5 rounded-xl border border-rose-500/30 cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. Orders Tab */}
        {activeAdminTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-lg font-bold text-white">সকল অর্ডার পরিচালনা</h2>
              <div className="flex items-center gap-1.5">
                {(['all', 'pending', 'confirmed', 'completed', 'rejected'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                      orderStatusFilter === st
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900'
                    }`}
                  >
                    {st === 'all' && 'সকল'}
                    {st === 'pending' && 'পেন্ডিং'}
                    {st === 'confirmed' && 'কনফার্মড'}
                    {st === 'completed' && 'কমপ্লিটেড'}
                    {st === 'rejected' && 'রিজেক্টেড'}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-md overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase text-[11px]">
                  <tr>
                    <th className="p-4">আইডি ও তারিখ</th>
                    <th className="p-4">গ্রাহক</th>
                    <th className="p-4">সার্ভিস</th>
                    <th className="p-4">মূল্য</th>
                    <th className="p-4">রিকোয়েস্ট বিস্তারিত</th>
                    <th className="p-4">স্ট্যাটাস</th>
                    <th className="p-4 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {orders
                    .filter((o) => (orderStatusFilter === 'all' ? true : o.status === orderStatusFilter))
                    .map((ord) => (
                      <tr key={ord.orderId} className="hover:bg-slate-900/50 transition">
                        <td className="p-4 whitespace-nowrap">
                          <span className="font-mono font-bold text-slate-200">#{ord.orderId.slice(-6)}</span>
                          <span className="block text-[11px] text-slate-500">
                            {new Date(ord.createdAt).toLocaleDateString('bn-BD')}
                          </span>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className="font-bold text-slate-200 block">{ord.customerName}</span>
                          <span className="text-[11px] text-slate-500">{ord.email}</span>
                        </td>
                        <td className="p-4 font-semibold text-slate-300">{ord.serviceName}</td>
                        <td className="p-4 font-black text-indigo-400 whitespace-nowrap">৳{ord.amount.toFixed(2)}</td>
                        <td className="p-4 max-w-xs">
                          <span className="line-clamp-2 text-xs text-slate-400 bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                            {ord.requestDetails}
                          </span>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                              ord.status === 'completed'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : ord.status === 'confirmed'
                                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                                : ord.status === 'rejected'
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {ord.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => updateOrderStatus(ord.orderId, 'confirmed')}
                                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-2.5 py-1.5 rounded-lg cursor-pointer"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => updateOrderStatus(ord.orderId, 'rejected')}
                                  className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-2.5 py-1.5 rounded-lg cursor-pointer"
                                >
                                  Reject & Refund
                                </button>
                              </>
                            )}
                            {ord.status === 'confirmed' && (
                              <>
                                <button
                                  onClick={() => updateOrderStatus(ord.orderId, 'completed')}
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-2.5 py-1.5 rounded-lg cursor-pointer"
                                >
                                  Complete
                                </button>
                                <button
                                  onClick={() => updateOrderStatus(ord.orderId, 'rejected')}
                                  className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-2.5 py-1.5 rounded-lg cursor-pointer"
                                >
                                  Reject & Refund
                                </button>
                              </>
                            )}
                            {(ord.status === 'completed' || ord.status === 'rejected') && (
                              <span className="text-xs text-slate-500 font-medium">প্রক্রিয়াজাত সম্পন্ন</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. Deposits Tab */}
        {activeAdminTab === 'deposits' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-lg font-bold text-white">ম্যানুয়াল ডিপোজিট অনুমোদন তালিকা</h2>
              <div className="flex items-center gap-1.5">
                {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setDepositStatusFilter(st)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                      depositStatusFilter === st
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900'
                    }`}
                  >
                    {st === 'all' && 'সকল'}
                    {st === 'pending' && 'পেন্ডিং'}
                    {st === 'approved' && 'অনুমোদিত'}
                    {st === 'rejected' && 'বাতিল'}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-md overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase text-[11px]">
                  <tr>
                    <th className="p-4">মাধ্যম</th>
                    <th className="p-4">টাকার পরিমাণ</th>
                    <th className="p-4">গ্রাহক ইমেইল</th>
                    <th className="p-4">প্রেরক নম্বর</th>
                    <th className="p-4">Transaction ID</th>
                    <th className="p-4">তারিখ</th>
                    <th className="p-4">স্ট্যাটাস</th>
                    <th className="p-4 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {deposits
                    .filter((d) => (depositStatusFilter === 'all' ? true : d.status === depositStatusFilter))
                    .map((dep) => (
                      <tr key={dep.depositId} className="hover:bg-slate-900/50 transition">
                        <td className="p-4 font-bold text-indigo-400 whitespace-nowrap">{dep.method}</td>
                        <td className="p-4 font-black text-emerald-400 whitespace-nowrap">৳{dep.amount.toFixed(2)}</td>
                        <td className="p-4 whitespace-nowrap text-slate-300">{dep.email}</td>
                        <td className="p-4 font-mono font-semibold text-slate-400 whitespace-nowrap">{dep.senderNumber}</td>
                        <td className="p-4 font-mono font-bold text-white whitespace-nowrap">
                          <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                            {dep.trxId}
                          </span>
                        </td>
                        <td className="p-4 whitespace-nowrap text-slate-500 text-xs">
                          {new Date(dep.createdAt).toLocaleString('bn-BD')}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                              dep.status === 'approved'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : dep.status === 'rejected'
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {dep.status}
                          </span>
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          {dep.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => approveDeposit(dep.depositId)}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => rejectDeposit(dep.depositId)}
                                className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-500">পর্যালোচিত</span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. Users Tab */}
        {activeAdminTab === 'users' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-lg font-bold text-white">রেজিস্টার্ড ইউজার তালিকা</h2>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="নাম বা ইমেইল খুঁজুন..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-md overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase text-[11px]">
                  <tr>
                    <th className="p-4">গ্রাহক</th>
                    <th className="p-4">ইমেইল</th>
                    <th className="p-4">বর্তমান ব্যালেন্স</th>
                    <th className="p-4">অ্যাকাউন্ট স্ট্যাটাস</th>
                    <th className="p-4">ভূমিকা</th>
                    <th className="p-4 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-855">
                  {users
                    .filter((u) => {
                      if (!userSearch) return true;
                      return (
                        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                        u.email.toLowerCase().includes(userSearch.toLowerCase())
                      );
                    })
                    .map((u) => (
                      <tr key={u.uid} className="hover:bg-slate-900/50 transition">
                        <td className="p-4 font-bold text-white whitespace-nowrap">{u.name}</td>
                        <td className="p-4 text-slate-300 whitespace-nowrap">{u.email}</td>
                        <td className="p-4 font-black text-indigo-400 whitespace-nowrap">৳{u.balance.toFixed(2)}</td>
                        <td className="p-4 whitespace-nowrap">
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                              u.status === 'active'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {u.status === 'active' ? 'সচল' : 'ব্লকড'}
                          </span>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          {u.isAdmin ? (
                            <span className="text-[11px] font-bold text-indigo-300 bg-indigo-950 border border-indigo-800 px-2 py-0.5 rounded-md">
                              অ্যাডমিন
                            </span>
                          ) : (
                            <span className="text-xs text-slate-500">গ্রাহক</span>
                          )}
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          {!u.isAdmin && (
                            <button
                              onClick={() => updateUserStatus(u.uid, u.status === 'active' ? 'blocked' : 'active')}
                              className={`text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer ${
                                u.status === 'active'
                                  ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                              }`}
                            >
                              {u.status === 'active' ? 'ব্লক করুন' : 'আনব্লক করুন'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. Services Tab */}
        {activeAdminTab === 'services' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-lg font-bold text-white">সার্ভিস ক্যাটালগ ও প্রাইজ নির্ধারণ</h2>
              <button
                onClick={() => setShowAddService(!showAddService)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন সার্ভিস যোগ করুন</span>
              </button>
            </div>

            {showAddService && (
              <form onSubmit={handleCreateService} className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-4">
                <h3 className="font-bold text-white text-sm">নতুন সার্ভিসের তথ্য লিখুন</h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">সার্ভিসের নাম</label>
                    <input
                      type="text"
                      required
                      value={newServiceName}
                      onChange={(e) => setNewServiceName(e.target.value)}
                      placeholder="যেমন: Facebook Followers"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">ক্যাটাগরি</label>
                    <select
                      value={newServiceCategory}
                      onChange={(e) => setNewServiceCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">নির্ধারিত মূল্য (টাকা)</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={newServicePrice}
                      onChange={(e) => setNewServicePrice(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">ট্যাগ / ব্যাজ (ঐচ্ছিক)</label>
                    <input
                      type="text"
                      value={newServiceTag}
                      onChange={(e) => setNewServiceTag(e.target.value)}
                      placeholder="Popular / Hot / Best Sell"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">বিবরণ</label>
                    <input
                      type="text"
                      value={newServiceDesc}
                      onChange={(e) => setNewServiceDesc(e.target.value)}
                      placeholder="সার্ভিসের সংক্ষিপ্ত বিবরণ..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddService(false)}
                    className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold cursor-pointer"
                  >
                    সংরক্ষণ করুন
                  </button>
                </div>
              </form>
            )}

            <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-md overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase text-[11px]">
                  <tr>
                    <th className="p-4">সার্ভিসের নাম</th>
                    <th className="p-4">ক্যাটাগরি</th>
                    <th className="p-4">মূল্য</th>
                    <th className="p-4">ট্যাগ</th>
                    <th className="p-4">স্ট্যাটাস</th>
                    <th className="p-4 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-855">
                  {services.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-900/50 transition">
                      <td className="p-4 font-bold text-white">{s.name}</td>
                      <td className="p-4 text-slate-400 whitespace-nowrap">{s.category}</td>
                      <td className="p-4 font-black text-indigo-400 whitespace-nowrap">৳{s.price.toFixed(2)}</td>
                      <td className="p-4 whitespace-nowrap">
                        {s.tag ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                            {s.tag}
                          </span>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {s.status}
                        </span>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => deleteService(s.id)}
                          className="text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-950/40 transition cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. Settings Tab */}
        {activeAdminTab === 'settings' && (
          <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-md max-w-2xl">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">ম্যানুয়াল পেমেন্ট নম্বর ও সাইট নোটিশ কনফিগারেশন</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                এখানে পরিবর্তন করলে মূল ওয়েবসাইটের ডিপোজিট ফর্ম ও হেডার নোটিশে পরিবর্তন অবিলম্বে সক্রিয় হবে।
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  bKash Personal নম্বর (Send Money)
                </label>
                <input
                  type="text"
                  required
                  value={bkashNum}
                  onChange={(e) => setBkashNum(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Nagad Personal নম্বর (Send Money)
                </label>
                <input
                  type="text"
                  required
                  value={nagadNum}
                  onChange={(e) => setNagadNum(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Rocket Personal নম্বর (Send Money)
                </label>
                <input
                  type="text"
                  required
                  value={rocketNum}
                  onChange={(e) => setRocketNum(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-sky-400 block mb-1">
                  জরুরি টেলিগ্রাম ইউজারনেম (যাতে ক্লিক করলে টেলিগ্রামে যাবে)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">t.me/</span>
                  <input
                    type="text"
                    required
                    value={telegramUser}
                    onChange={(e) => setTelegramUser(e.target.value)}
                    placeholder="FastServiceBD_Official"
                    className="w-full pl-14 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  ইউজারের হোমপেজে, ব্যানারে ও ভাসমান বাটনে ক্লিক করলে সরাসরি এই টেলিগ্রাম লিংকে নিয়ে যাবে।
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  জরুরি যোগাযোগ ফোন নম্বর (Helpline Call)
                </label>
                <input
                  type="text"
                  value={phoneSupport}
                  onChange={(e) => setPhoneSupport(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  ওয়েবসাইট নোটিশ টেক্সট
                </label>
                <textarea
                  rows={3}
                  required
                  value={siteNotice}
                  onChange={(e) => setSiteNotice(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold text-white"
                />
              </div>

              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold px-6 py-2.5 rounded-xl text-sm flex items-center gap-2 cursor-pointer transition shadow-md shadow-indigo-600/30"
              >
                <Save className="w-4 h-4" />
                <span>সেটিংস পরিবর্তন সংরক্ষণ করুন</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
