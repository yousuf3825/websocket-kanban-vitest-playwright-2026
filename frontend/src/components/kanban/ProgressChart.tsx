import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface ProgressChartProps {
  stats: {
    todo: number;
    inProgress: number;
    done: number;
    total: number;
    completionPercent: number;
  };
}

const COLORS = [
  "hsl(230, 80%, 56%)",
  "hsl(38, 92%, 50%)",
  "hsl(142, 71%, 45%)",
];

export function ProgressChart({ stats }: ProgressChartProps) {
  const data = [
    { name: "To Do", value: stats.todo },
    { name: "In Progress", value: stats.inProgress },
    { name: "Done", value: stats.done },
  ].filter((d) => d.value > 0);

  if (stats.total === 0) return null;

  return (
    <div className="flex items-center gap-6 p-4 bg-card rounded-xl border border-border">
      <div className="w-20 h-20 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={24}
              outerRadius={36}
              dataKey="value"
              strokeWidth={2}
              stroke="hsl(var(--card))"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[["To Do", "In Progress", "Done"].indexOf(data[i]?.name) % 3] || COLORS[0]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-foreground">{stats.completionPercent}%</span>
        </div>
      </div>
      <div className="flex gap-4 text-xs">
        {[
          { label: "To Do", value: stats.todo, color: COLORS[0] },
          { label: "In Progress", value: stats.inProgress, color: COLORS[1] },
          { label: "Done", value: stats.done, color: COLORS[2] },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
            <span className="text-muted-foreground">
              {item.label}: <span className="font-semibold text-foreground">{item.value}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
