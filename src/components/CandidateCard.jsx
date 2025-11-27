import { Button, Card } from "antd";
import { Vote } from "lucide-react";

export default function CandidateCard({ candidate, onVote, loading, isAdmin }) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-all">
      <h3 className="text-lg font-semibold text-indigo-700">
        {candidate.name}
      </h3>
      <p className="text-gray-600 mb-3">Phiếu: {candidate.voteCount}</p>
      {!isAdmin && (
        <Button
          type="default"
          icon={<Vote size={16} />}
          onClick={() => onVote(candidate.id)}
          loading={loading}
          className="w-full"
        >
          Bỏ phiếu
        </Button>
      )}
    </Card>
  );
}
