import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Courses", path: "/courses" },
  { name: "Tools", path: "/tools" },
];

const authLinks = [
  { name: "Login", path: "/login" },
  { name: "Register", path: "/register" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userProfile, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    setIsProfileOpen(false);
    navigate("/login");
  };

  const handleDashboardClick = () => {
    setIsProfileOpen(false);
    if (userProfile?.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/student");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/acadvizen-logo.png"
              alt="Acadvizen"
              className="h-10 lg:h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <span className="hidden sm:block font-display text-lg lg:text-xl font-bold text-gradient">
              ACADVIZEN
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-all duration-300 hover:text-primary ${
                  isActive(link.path)
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* User Section - Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            {user && userProfile ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors text-foreground"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">{userProfile.name || "User"}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-card rounded-lg shadow-lg border border-border animate-fade-in">
                    <div className="p-4 border-b border-border">
                      <p className="text-sm text-muted-foreground">
                        {userProfile.email || user.email}
                      </p>
                      <p className="text-xs text-primary font-medium capitalize mt-1">
                        {userProfile.role}
                      </p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={handleDashboardClick}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary/10 text-foreground text-sm font-medium transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-red-500/10 text-red-600 text-sm font-medium transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-foreground hover:text-primary hover:bg-primary/10">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-teal">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`font-medium py-2 transition-colors ${
                    isActive(link.path)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {user && userProfile ? (
                <div className="flex flex-col gap-2 pt-4 border-t border-border">
                  <div className="px-2 py-2">
                    <p className="text-sm font-medium">{userProfile.name || "User"}</p>
                    <p className="text-xs text-muted-foreground">
                      {userProfile.email || user.email}
                    </p>
                    <p className="text-xs text-primary font-medium capitalize mt-1">
                      {userProfile.role}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      handleDashboardClick();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary/10 text-foreground text-sm font-medium transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-red-500/10 text-red-600 text-sm font-medium transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-4 border-t border-border">
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-primary text-primary-foreground">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

