interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  color: string;
  onClick?: () => void;
  index?: number;
}

export default function StatCard({ icon, label, value, color, onClick, index = 0 }: StatCardProps) {
  const staggerClass = index > 0 && index <= 8 ? `stagger-${index}` : "";
  return (
    <div
      onClick={onClick}
      className={`group bg-white/10 backdrop-blur-md rounded-lg border border-rose-100/60 p-5 cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md hover:border-rose-200 active:scale-[0.98] animate-card-stagger ${staggerClass}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-rose-200/80">{label}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-3 ${color}`}>
          <span className="w-5 h-5 flex items-center justify-center">
            <i className={icon} />
          </span>
        </div>
      </div>
    </div>
  );
}
