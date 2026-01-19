import { useState } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { LandingPage } from "./components/pages/LandingPage";
import { LoginPage } from "./components/pages/LoginPage";
import { SignupPage } from "./components/pages/SignupPage";
import { DashboardPage } from "./components/pages/DashboardPage";
import { ProfilePage } from "./components/pages/ProfilePage";
import { OpportunityDashboardPage } from "./components/pages/OpportunityDashboardPage";
import { CreateOpportunityPage } from "./components/pages/CreateOpportunityPage";
import { OpportunityDetailPage } from "./components/pages/OpportunityDetailPage";
import { EditOpportunityPage } from "./components/pages/EditOpportunityPage";
import { SchedulePickupPage } from "./components/pages/SchedulePickupPage";
import { PickupDashboardPage } from "./components/pages/PickupDashboardPage";
import { MessagesPage } from "./components/pages/MessagesPage";
import { AdminDashboardPage } from "./components/pages/AdminDashboardPage";
import { AnalyticsDashboardPage } from "./components/pages/AnalyticsDashboardPage";
import { AdminControlPage } from "./components/pages/AdminControlPage";
import { ReportGenerationPage } from "./components/pages/ReportGenerationPage";
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "./components/ThemeProvider";

import { login, signup, getUser, setAuthToken } from "./services/api";

type Page =
  | 'landing'
  | 'login'
  | 'signup'
  | 'dashboard'
  | 'profile'
  | 'opportunities'
  | 'create-opportunity'
  | 'opportunity-detail'
  | 'edit-opportunity'
  | 'schedule-pickup'
  | 'pickup-dashboard'
  | 'messages'
  | 'admin-dashboard'
  | 'analytics'
  | 'admin-control'
  | 'reports';

type UserRole = 'volunteer' | 'ngo' | 'admin' | 'pickup_agent';

type User = {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
} | null;

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [user, setUser] = useState<User>(null);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null);

  // Navigation handler
  const handleNavigate = (page: string, opportunityId?: string) => {
    setCurrentPage(page as Page);
    if (opportunityId) setSelectedOpportunityId(opportunityId);
    window.scrollTo(0, 0);
  };

  // REAL login (connected to backend)
  const handleLogin = async (email: string, password: string) => {
    try {
      const res = await login(email, password);

      setUser({
        _id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        role: res.user.role,
      });

      if (res.user.role === 'admin') {
        setCurrentPage('admin-dashboard');
      } else {
        setCurrentPage('dashboard');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  // REAL signup (backend)
  const handleSignup = async (name: string, email: string, password: string, role: UserRole) => {
    try {
      const res = await signup({ name, email, password, role });

      setUser({
        _id: res._id,
        name: res.name,
        email: res.email,
        role: res.role,
      });

      setCurrentPage('dashboard');
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Logout
  const handleLogout = () => {
    setUser(null);
    setAuthToken(null);
    setCurrentPage('landing');
  };

  // Render selected screen
  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;

      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />;

      case 'signup':
        return <SignupPage onSignup={handleSignup} onNavigate={handleNavigate} />;

      case 'dashboard':
        if (!user) return null;
        return <DashboardPage userRole={user.role} userName={user.name} onNavigate={handleNavigate} />;

      case 'profile':
        if (!user) return null;
        return <ProfilePage userRole={user.role} userName={user.name} userEmail={user.email} />;

      case 'opportunities':
        if (!user) return null;
        return <OpportunityDashboardPage userRole={user.role} onNavigate={handleNavigate} />;

      case 'create-opportunity':
        if (!user || user.role !== 'ngo') return null;
        return <CreateOpportunityPage onNavigate={handleNavigate} />;

      case 'opportunity-detail':
        if (!user || !selectedOpportunityId) return null;
        return (
          <OpportunityDetailPage
            opportunityId={selectedOpportunityId}
            userRole={user.role}
            onNavigate={handleNavigate}
          />
        );

      case 'edit-opportunity':
        if (!user || user.role !== 'ngo' || !selectedOpportunityId) return null;
        return <EditOpportunityPage opportunityId={selectedOpportunityId} onNavigate={handleNavigate} />;

      case 'schedule-pickup':
        if (!user) return null;
        return <SchedulePickupPage onNavigate={handleNavigate} />;

      case 'pickup-dashboard':
        if (!user) return null;
        return (
          <PickupDashboardPage
            currentUserId={user._id}
            role={user.role}
          />
        );

      case 'messages':
        if (!user) return null;
        return <MessagesPage onNavigate={handleNavigate} currentUserId={user._id} />;

      case 'admin-dashboard':
        if (!user || user.role !== 'admin') return null;
        return <AdminDashboardPage onNavigate={handleNavigate} />;

      case 'analytics':
        if (!user || user.role !== 'admin') return null;
        return <AnalyticsDashboardPage onNavigate={handleNavigate} />;

      case 'admin-control':
        if (!user || user.role !== 'admin') return null;
        return <AdminControlPage onNavigate={handleNavigate} />;

      case 'reports':
        if (!user || user.role !== 'admin') return null;
        return <ReportGenerationPage onNavigate={handleNavigate} />;

      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        <Header
          isLoggedIn={!!user}
          userName={user?.name}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          currentPage={currentPage}
        />

        <main className="flex-1">{renderPage()}</main>

        {currentPage === 'landing' && <Footer />}
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
