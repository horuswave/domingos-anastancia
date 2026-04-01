import { Users, CheckCircle, XCircle, Clock, Heart } from "lucide-react";

interface Stats {
  total: number;
  attending: number;
  declined: number;
  pending: number;
  totalHeadcount: number;
}

export default function DashboardStats({ stats }: { stats: Stats }) {
  const cards = [
    {
      label: "Total Households",
      value: stats.total,
      icon: <Users className="w-5 h-5" />,
      color: "text-stone-600",
      bg: "bg-stone-50",
    },
    {
      label: "Attending",
      value: stats.attending,
      icon: <CheckCircle className="w-5 h-5" />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Declined",
      value: stats.declined,
      icon: <XCircle className="w-5 h-5" />,
      color: "text-red-500",
      bg: "bg-red-50",
    },
    {
      label: "Awaiting Reply",
      value: stats.pending,
      icon: <Clock className="w-5 h-5" />,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Total Headcount",
      value: stats.totalHeadcount,
      icon: <Heart className="w-5 h-5" />,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className={`${c.bg} border border-stone-100 rounded p-5`}
        >
          <div className={`${c.color} mb-3`}>{c.icon}</div>
          <div
            className="text-3xl text-stone-800"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {c.value}
          </div>
          <div className="text-stone-500 text-xs mt-1">{c.label}</div>
        </div>
      ))}
    </div>
  );
}
