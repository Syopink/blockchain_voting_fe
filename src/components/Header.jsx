import { Button } from "antd";
import { Wallet } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header({ account, connectWallet }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Lỗi parse user:", e);
      }
    }
  }, []);

  return (
    <header className="flex justify-between items-center bg-indigo-600 text-white p-4 rounded-2xl shadow-md mb-6">
      <h1 className="text-xl font-bold">
        Name: {user ? user.name : "Chưa đăng nhập"}
      </h1>
      <Button
        type="primary"
        onClick={connectWallet}
        icon={<Wallet size={16} />}
        className="bg-white text-indigo-600 border-none hover:bg-indigo-100"
      >
        {account ? account : "Kết nối ví"}
      </Button>
    </header>
  );
}
