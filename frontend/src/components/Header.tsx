import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { Menu, X, User, LogOut, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { NotificationDropdown } from "./NotificationDropdown";

import { useTheme } from "./ThemeProvider";

type HeaderProps = {
  isLoggedIn?: boolean;
  userName?: string;
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
  currentPage?: string;
};

export function Header({ isLoggedIn, userName, onNavigate, onLogout, currentPage }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <button onClick={() => onNavigate?.('landing')} className="cursor-pointer">
          <Logo />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {!isLoggedIn ? (
            <>
              <a
                onClick={() => onNavigate?.('landing')}
                className="text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
              >
                About
              </a>
              <a
                onClick={() => onNavigate?.('landing')}
                className="text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
              >
                How it Works
              </a>
              <a
                onClick={() => onNavigate?.('landing')}
                className="text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
              >
                FAQ
              </a>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                title="Toggle theme"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                onClick={() => onNavigate?.('login')}
              >
                Login
              </Button>
              <Button
                onClick={() => onNavigate?.('signup')}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Sign Up
              </Button>
            </>
          ) : (
            <>
              <Button
                variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
                onClick={() => onNavigate?.('dashboard')}
              >
                Dashboard
              </Button>
              <Button
                variant={currentPage === 'opportunities' ? 'default' : 'ghost'}
                onClick={() => onNavigate?.('opportunities')}
              >
                Opportunities
              </Button>
              <Button
                variant={currentPage === 'messages' ? 'default' : 'ghost'}
                onClick={() => onNavigate?.('messages')}
              >
                Messages
              </Button>
              <Button
                variant={currentPage === 'profile' ? 'default' : 'ghost'}
                onClick={() => onNavigate?.('profile')}
              >
                Profile
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  title="Toggle theme"
                >
                  {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </Button>
                <NotificationDropdown onNavigate={onNavigate} />
                <div className="flex items-center gap-2 text-sm ml-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span>{userName}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onLogout}
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-card">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {!isLoggedIn ? (
              <>
                <a
                  onClick={() => { onNavigate?.('landing'); setMobileMenuOpen(false); }}
                  className="py-2 text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
                >
                  About
                </a>
                <a
                  onClick={() => { onNavigate?.('landing'); setMobileMenuOpen(false); }}
                  className="py-2 text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
                >
                  How it Works
                </a>
                <a
                  onClick={() => { onNavigate?.('landing'); setMobileMenuOpen(false); }}
                  className="py-2 text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
                >
                  FAQ
                </a>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={toggleTheme}
                >
                  {theme === 'light' ? <Moon className="w-4 h-4 mr-2" /> : <Sun className="w-4 h-4 mr-2" />}
                  {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => { onNavigate?.('login'); setMobileMenuOpen(false); }}
                >
                  Login
                </Button>
                <Button
                  onClick={() => { onNavigate?.('signup'); setMobileMenuOpen(false); }}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span>{userName}</span>
                  </div>
                  <NotificationDropdown onNavigate={onNavigate} />
                </div>
                <Button
                  variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
                  className="justify-start"
                  onClick={() => { onNavigate?.('dashboard'); setMobileMenuOpen(false); }}
                >
                  Dashboard
                </Button>
                <Button
                  variant={currentPage === 'opportunities' ? 'default' : 'ghost'}
                  className="justify-start"
                  onClick={() => { onNavigate?.('opportunities'); setMobileMenuOpen(false); }}
                >
                  Opportunities
                </Button>
                <Button
                  variant={currentPage === 'messages' ? 'default' : 'ghost'}
                  className="justify-start"
                  onClick={() => { onNavigate?.('messages'); setMobileMenuOpen(false); }}
                >
                  Messages
                </Button>
                <Button
                  variant={currentPage === 'profile' ? 'default' : 'ghost'}
                  className="justify-start"
                  onClick={() => { onNavigate?.('profile'); setMobileMenuOpen(false); }}
                >
                  Profile
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={toggleTheme}
                >
                  {theme === 'light' ? <Moon className="w-4 h-4 mr-2" /> : <Sun className="w-4 h-4 mr-2" />}
                  {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start text-destructive hover:text-destructive"
                  onClick={() => { onLogout?.(); setMobileMenuOpen(false); }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}