import { useCallback, useEffect, useState } from "react";
import { Button, Input, message, Popconfirm, Spin } from "antd";
import Header from "../components/Header";
import ResultChart from "../components/ResultChart";
import CandidateCard from "../components/CandidateCard";
import { getContract } from "../utils/contract";

export default function AdminDashboard() {
  const [account, setAccount] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [newCandidate, setNewCandidate] = useState("");
  const [loading, setLoading] = useState(false);
  const [votingOpen, setVotingOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // --- Kết nối ví ---
  const connectWallet = async () => {
    if (!window.ethereum) {
      message.error("Vui lòng cài MetaMask để kết nối ví!");
      return;
    }
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const selected = accounts[0];
      setAccount(selected);
      checkAdmin(selected);
    } catch (err) {
      console.error("Lỗi khi kết nối ví:", err);
      message.error("Kết nối ví thất bại!");
    }
  };

  const checkAdmin = useCallback(async (wallet) => {
    try {
      const contract = await getContract();
      const adminAddress = await contract.admin();

      if (adminAddress.toLowerCase() === wallet.toLowerCase()) {
        setIsAdmin(true);
        message.success("Đăng nhập với quyền admin thành công!");
        loadCandidates();
      } else {
        setIsAdmin(false);
        message.error("Ví này không có quyền admin!");
      }
    } catch (err) {
      console.error("Lỗi khi kiểm tra admin:", err);
      message.error("Không thể xác minh quyền admin!");
    }
  }, []);

  // --- Load danh sách ứng viên ---
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

      const open = await contract.votingOpen();
      setVotingOpen(open);
    } catch (err) {
      console.error("Lỗi khi load ứng viên:", err);
    }
  };

  // --- Thêm ứng viên ---
  const addCandidate = async () => {
    if (!newCandidate) return message.warning("Nhập tên ứng viên!");
    try {
      setLoading(true);
      const contract = await getContract();
      const tx = await contract.addCandidate(newCandidate);
      await tx.wait();
      message.success("Đã thêm ứng viên!");
      setNewCandidate("");
      await loadCandidates();
    } catch (err) {
      message.error(err.reason || err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Xóa ứng viên ---
  const removeCandidate = async (id) => {
    try {
      setLoading(true);
      const contract = await getContract();
      const tx = await contract.removeCandidate(id);
      await tx.wait();
      message.success("Đã xóa ứng viên!");
      loadCandidates();
    } catch (error) {
      message.error(error.reason || error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Đóng / mở bầu cử ---
  const toggleVoting = async () => {
    try {
      setLoading(true);
      const contract = await getContract();
      const tx = votingOpen
        ? await contract.endVoting()
        : await contract.startVoting();
      await tx.wait();
      message.info(votingOpen ? "Đã đóng bầu cử" : "Đã mở bầu cử");
      setVotingOpen(!votingOpen);
    } catch (err) {
      message.error(err.reason || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkWallet = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          const wallet = accounts[0];
          setAccount(wallet);
          await checkAdmin(wallet);
        }
      }
    };
    checkWallet();
  }, [checkAdmin]);

  if (!account) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <h2 className="text-xl font-semibold mb-4">
          Vui lòng kết nối ví để truy cập
        </h2>
        <Button type="primary" onClick={connectWallet}>
          Kết nối ví MetaMask
        </Button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <h2 className="text-xl font-semibold mb-4 text-red-500">
          Ví hiện tại không có quyền admin
        </h2>
        <Button onClick={connectWallet} type="primary">
          Kết nối lại ví admin
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-6">
      <div className="max-w-5xl mx-auto">
        <Header account={account} connectWallet={connectWallet} />

        <div className="flex flex-wrap gap-3 mb-6 items-center">
          <Input
            placeholder="Tên ứng viên mới"
            value={newCandidate}
            onChange={(e) => setNewCandidate(e.target.value)}
            className="max-w-xs"
          />
          <Button type="primary" onClick={addCandidate} loading={loading}>
            Thêm
          </Button>
          <Button
            danger={votingOpen}
            onClick={toggleVoting}
            loading={loading}
            type="default"
          >
            {votingOpen ? "Đóng bầu cử" : "Mở bầu cử"}
          </Button>
        </div>

        <Spin spinning={loading}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
            {candidates.map((c) => (
              <div
                key={c.id}
                className="relative bg-white rounded-2xl shadow p-4 border border-gray-100"
              >
                <CandidateCard
                  candidate={c}
                  onVote={() => {}}
                  loading={false}
                  isAdmin={isAdmin}
                />
                <Popconfirm
                  title="Xóa ứng cử viên này?"
                  okText="Xóa"
                  cancelText="Hủy"
                  onConfirm={() => removeCandidate(c.id)}
                >
                  <Button
                    danger
                    size="small"
                    className="absolute top-2 right-2"
                  >
                    Xóa
                  </Button>
                </Popconfirm>
              </div>
            ))}
          </div>
        </Spin>

        <ResultChart data={candidates} />
      </div>
    </div>
  );
}
