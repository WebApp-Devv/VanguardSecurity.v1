import { useEffect, useState } from "react";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const TOKEN_KEY = "vanguard_admin_token";

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(!!localStorage.getItem(TOKEN_KEY));

  useEffect(() => {
    document.body.style.overflow = "";
    if (!token) {
      setChecking(false);
      return;
    }
    axios
      .get(`${API}/admin/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken("");
      })
      .finally(() => setChecking(false));
  }, [token]);

  const handleLogin = (newToken, newUser) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setUser(newUser);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setUser(null);
  };

  return (
    <div className="bg-ink text-white font-body min-h-screen">
      <div className="noise-overlay" aria-hidden="true" />
      <div className="absolute inset-0 gold-radial pointer-events-none" />
      {checking ? (
        <div className="min-h-screen flex items-center justify-center" data-testid="admin-loading">
          <LoaderCircle size={32} className="animate-spin text-gold" />
        </div>
      ) : user && token ? (
        <AdminDashboard token={token} user={user} onLogout={handleLogout} />
      ) : (
        <AdminLogin onSuccess={handleLogin} />
      )}
    </div>
  );
}
