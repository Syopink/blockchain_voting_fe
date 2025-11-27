import { useState } from "react";
import { Button, Card, message } from "antd";

const ConnectWallet = ({ user, onConnect }) => {
  const [wallet, setWallet] = useState(user?.walletAddress || "");
  const [loading, setLoading] = useState(false);

  const checkMetaMask = () => {
    if (!window.ethereum) {
      message.error("Vui lòng cài MetaMask!");
      return false;
    }
    return true;
  };

  const handleConnectMetaMask = async () => {
    if (!checkMetaMask()) return;

    try {
      setLoading(true);
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setWallet(account);
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWallet = async () => {
    if (!wallet) return message.error("Chưa có địa chỉ ví để lưu!");
    setLoading(true);
    try {
      const res = await fetch(
        "https://m5x471n0-5005.asse.devtunnels.ms/api/v1/connect-wallet",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, walletAddress: wallet }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        message.success("Wallet connected successfully!");
        onConnect(wallet);
      } else {
        message.error(data.message || "Kết nối wallet thất bại");
      }
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f5f5f5",
      }}
    >
      <Card style={{ width: 400, padding: 24 }}>
        <h2>Connect Wallet</h2>

        {wallet ? (
          <p>Đã kết nối: {wallet}</p>
        ) : (
          <Button
            type="primary"
            onClick={handleConnectMetaMask}
            block
            style={{ marginBottom: 16 }}
          >
            Kết nối MetaMask
          </Button>
        )}

        <Button
          type="primary"
          onClick={handleSaveWallet}
          loading={loading}
          block
          disabled={!wallet}
        >
          Lưu địa chỉ ví
        </Button>
      </Card>
    </div>
  );
};

export default ConnectWallet;
