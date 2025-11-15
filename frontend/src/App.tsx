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
import { MessagesPage } from "./components/pages/MessagesPage";
import { AdminDashboardPage } from "./components/pages/AdminDashboardPage";
import { AnalyticsDashboardPage } from "./components/pages/AnalyticsDashboardPage";
import { AdminControlPage } from "./components/pages/AdminControlPage";
import { ReportGenerationPage } from "./components/pages/ReportGenerationPage";
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "./components/ThemeProvider";

type Page = 'landing' | 'login' | 'signup' | 'dashboard' | 'profile' | 'opportunities' | 'create-opportunity' | 'opportunity-detail' | 'edit-opportunity' | 'schedule-pickup' | 'messages' | 'admin-dashboard' | 'analytics' | 'admin-control' | 'reports';
type UserRole = 'volunteer' | 'ngo' | 'admin' | null;

type User = {
  name: string;
  email: string;
  role: 'volunteer' | 'ngo' | 'admin';
} | null;

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [user, setUser] = useState<User>(null);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<number | null>(null);

  const handleNavigate = (page: string, opportunityId?: number) => {
    setCurrentPage(page as Page);
    if (opportunityId !== undefined) {
      setSelectedOpportunityId(opportunityId);
    }
    window.scrollTo(0, 0);
  };

  const handleLogin = (email: string, password: string) => {
    // Mock login - in real app, would call API
    // For demo, create a user based on email
    let role: 'volunteer' | 'ngo' | 'admin' = 'volunteer';
    if (email.includes('admin')) {
      role = 'admin';
    } else if (email.includes('ngo')) {
      role = 'ngo';
    }
    
    const mockUser: User = {
      name: email.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email: email,
      role: role
    };
    setUser(mockUser);
    setCurrentPage('dashboard');
  };

  const handleSignup = (name: string, email: string, password: string, role: 'volunteer' | 'ngo') => {
    // Mock signup - in real app, would call API
    const newUser: User = {
      name: name,
      email: email,
      role: role
    };
    setUser(newUser);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('landing');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />;
      
      case 'signup':
        return <SignupPage onSignup={handleSignup} onNavigate={handleNavigate} />;
      
      case 'dashboard':
        if (!user) {
          setCurrentPage('login');
          return null;
        }
        return <DashboardPage userRole={user.role} userName={user.name} onNavigate={handleNavigate} />;
      
      case 'profile':
        if (!user) {
          setCurrentPage('login');
          return null;
        }
        return <ProfilePage userRole={user.role} userName={user.name} userEmail={user.email} />;
      
      case 'opportunities':
        if (!user) {
          setCurrentPage('login');
          return null;
        }
        return <OpportunityDashboardPage userRole={user.role} onNavigate={handleNavigate} />;
      
      case 'create-opportunity':
        if (!user || user.role !== 'ngo') {
          setCurrentPage('opportunities');
          return null;
        }
        return <CreateOpportunityPage onNavigate={handleNavigate} />;
      
      case 'opportunity-detail':
        if (!user || selectedOpportunityId === null) {
          setCurrentPage('opportunities');
          return null;
        }
        return <OpportunityDetailPage opportunityId={selectedOpportunityId} userRole={user.role} onNavigate={handleNavigate} />;
      
      case 'edit-opportunity':
        if (!user || user.role !== 'ngo' || selectedOpportunityId === null) {
          setCurrentPage('opportunities');
          return null;
        }
        return <EditOpportunityPage opportunityId={selectedOpportunityId} onNavigate={handleNavigate} />;
      
      case 'schedule-pickup':
        if (!user) {
          setCurrentPage('login');
          return null;
        }
        return <SchedulePickupPage onNavigate={handleNavigate} />;
      
      case 'messages':
        if (!user) {
          setCurrentPage('login');
          return null;
        }
        return <MessagesPage onNavigate={handleNavigate} />;
      
      case 'admin-dashboard':
        if (!user || user.role !== 'admin') {
          setCurrentPage('dashboard');
          return null;
        }
        return <AdminDashboardPage onNavigate={handleNavigate} />;
      
      case 'analytics':
        if (!user || user.role !== 'admin') {
          setCurrentPage('dashboard');
          return null;
        }
        return <AnalyticsDashboardPage onNavigate={handleNavigate} />;
      
      case 'admin-control':
        if (!user || user.role !== 'admin') {
          setCurrentPage('dashboard');
          return null;
        }
        return <AdminControlPage onNavigate={handleNavigate} />;
      
      case 'reports':
        if (!user || user.role !== 'admin') {
          setCurrentPage('dashboard');
          return null;
        }
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
        
        <main className="flex-1">
          {renderPage()}
        </main>
        
        {currentPage === 'landing' && <Footer />}
        
        <Toaster />
      </div>
    </ThemeProvider>
  );
}