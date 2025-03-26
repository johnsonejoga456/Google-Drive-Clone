import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface StorageUsageSectionProps {
  storageUsed: number;
}

export default function StorageUsageSection({ storageUsed }: StorageUsageSectionProps) {
  const storageData = [
    { name: "Used", value: storageUsed },
    { name: "Free", value: 1024 - storageUsed },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 ring-1 ring-purple-300/50">
      <h2 className="text-xl font-semibold text-purple-900 mb-4">Storage Usage</h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={storageData}>
          <XAxis dataKey="name" stroke="#9333ea" />
          <YAxis stroke="#9333ea" />
          <Tooltip
            contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", color: "#4c1d95" }}
          />
          <Bar dataKey="value" fill="#facc15" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-sm text-indigo-400 mt-2">
        {storageUsed.toFixed(2)} MB of 1024 MB used
      </p>
    </div>
  );
}