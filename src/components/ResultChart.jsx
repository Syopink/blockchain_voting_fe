import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ResultChart({ data }) {
  return (
    <div className="bg-white shadow-md p-4 rounded-xl">
      <h2 className="text-lg font-semibold mb-3 text-indigo-700">
        Kết quả bầu chọn
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            formatter={(value) => [`${value} phiếu`, "Số lượng"]}
            cursor={{ fill: "rgba(99, 102, 241, 0.1)" }}
          />
          <Bar dataKey="voteCount" fill="#6366f1" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
