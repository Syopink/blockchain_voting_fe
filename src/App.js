import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminDashboard from "./pages/AdminDashboard";
import VoterView from "./pages/VoterView";
import AuthPage from "./pages/AuthPage";
import ConnectWallet from "./pages/ConnectWallet";
export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  const handleLoginSuccess = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const handleWalletConnected = (walletAddress) => {
    const updatedUser = { ...user, walletAddress };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <BrowserRouter>
      <div className="p-4 flex justify-between items-center text-indigo-600 font-semibold">
        <a href="/" className="flex items-center gap-2">
          <img
            src="./blockchain.png"
            alt="Logo"
            className="w-10 h-10 object-contain"
          />
          <span className="text-lg font-bold">Voting App</span>
        </a>

        <div className="flex items-center gap-6">
          {!user && <a href="/auth">Đăng nhập/ Đăng ký</a>}
          {user?.role === "voter" && <a href="/">Ứng viên</a>}
          {user?.role === "admin" && <a href="/admin">Quản trị viên</a>}
          {user && (
            <button
              onClick={handleLogout}
              className="text-red-500 border border-red-500 px-2 rounded"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      <Routes>
        <Route
          path="/auth"
          element={
            !user ? (
              <AuthPage onLoginSuccess={handleLoginSuccess} />
            ) : user.walletAddress ? (
              <Navigate to={user.role === "admin" ? "/admin" : "/"} />
            ) : (
              <Navigate to="/connect-wallet" />
            )
          }
        />

        <Route
          path="/connect-wallet"
          element={
            user && !user.walletAddress ? (
              <ConnectWallet user={user} onConnect={handleWalletConnected} />
            ) : (
              <Navigate to={user?.role === "admin" ? "/admin" : "/"} />
            )
          }
        />

        <Route
          path="/"
          element={
            user?.role === "voter" ? (
              <VoterView user={user} />
            ) : (
              <Navigate to={user?.role === "admin" ? "/admin" : "/auth"} />
            )
          }
        />
        <Route
          path="/admin"
          element={
            user?.role === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to={user?.role === "voter" ? "/" : "/auth"} />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
