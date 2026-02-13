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
    <div className="w-full min-h-screen  flex items-center justify-center">
  <div className="flex flex-col items-center p-10 bg-card rounded-2xl border border-border w-full max-w-4xl">

    {/* Huge Donut Chart (Top Row) */}
    <div className="w-56 h-56 relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={95}
            dataKey="value"
            strokeWidth={5}
            stroke="hsl(var(--card))"
          >
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={
                  COLORS[
                    ["To Do", "In Progress", "Done"].indexOf(data[i]?.name) % 3
                  ] || COLORS[0]
                }
              />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "12px",
              fontSize: "14px",
              padding: "10px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Center Percentage */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-extrabold text-foreground">
          {stats.completionPercent}%
        </span>
      </div>
    </div>

    {/* Legend Below Chart */}
    <div className="flex flex-col gap-4 mt-8 text-lg">
      {[
        { label: "To Do", value: stats.todo, color: COLORS[0] },
        { label: "In Progress", value: stats.inProgress, color: COLORS[1] },
        { label: "Done", value: stats.done, color: COLORS[2] },
      ].map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-4 justify-center"
        >
          <div
            className="w-5 h-5 rounded-full"
            style={{ background: item.color }}
          />

          <span className="text-muted-foreground">
            {item.label}:{" "}
            <span className="font-bold text-foreground">
              {item.value}
            </span>
          </span>
        </div>
      ))}
    </div>
  </div>
</div>

  );
}
