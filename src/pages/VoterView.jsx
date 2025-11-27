import { useEffect, useState } from "react";
import Header from "../components/Header";
import CandidateCard from "../components/CandidateCard";
import ResultChart from "../components/ResultChart";
import { getContract } from "../utils/contract";
import { message, Spin } from "antd";

export default function VoterView({ user }) {
  const [account, setAccount] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) return message.error("Vui lòng cài MetaMask!");
    try {
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (user.walletAddress?.toLowerCase() !== account.toLowerCase()) {
        return message.error("Ví MetaMask không trùng với ví đã liên kết!");
      }

      setAccount(account);
      message.success(`Đã kết nối ví: ${account}`);
    } catch (err) {
      message.error("Kết nối ví thất bại!");
    }
  };

  const loadCandidates = async () => {
    try {
      const contract = await getContract();
      const all = await contract.getAllCandidates();

      const list = all.map((c) => ({
        id: Number(c.id),
        name: c.name,
        voteCount: Number(c.voteCount),
      }));
      setCandidates(list);
    } catch (err) {
      console.error("Lỗi khi load ứng viên:", err);
    }
  };

  const vote = async (id) => {
    if (!account) {
      return message.warning("Vui lòng kết nối ví trước khi vote!");
    }
    try {
      setLoading(true);
      const contract = await getContract();
      const tx = await contract.vote(id);
      await tx.wait();
      message.success("Vote thành công!");
      await loadCandidates();
    } catch (err) {
      console.log("err", err);
      message.error(err.reason || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          message.info(`Đã chuyển sang ví: ${accounts[0].slice(0, 6)}...`);
        } else {
          setAccount("");
          message.warning("Chưa có ví nào được kết nối!");
        }
      });
    }

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener("accountsChanged", () => {});
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-white p-6">
      <div className="max-w-5xl mx-auto">
        <Header account={account} connectWallet={connectWallet} />

        <Spin spinning={loading}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
            {candidates.map((c) => (
              <CandidateCard
                key={c.id}
                candidate={c}
                onVote={vote}
                loading={loading}
              />
            ))}
          </div>
        </Spin>

        <ResultChart data={candidates} />
      </div>
    </div>
  );
}
