import CalendarHeatmap from "react-calendar-heatmap";
import { Tooltip } from "react-tooltip";
import "react-calendar-heatmap/dist/styles.css";
import "react-tooltip/dist/react-tooltip.css";

interface ActivityHeatmapProps {
  sessions: {
    createdAt: string | Date;
  }[];
}

function ActivityHeatmap({ sessions }: ActivityHeatmapProps) {
  const activityMap = new Map<string, number>();

  sessions.forEach((session) => {
    const dateStr = new Date(session.createdAt).toISOString().split("T")[0];
    activityMap.set(dateStr, (activityMap.get(dateStr) || 0) + 1);
  });

  const values = Array.from(activityMap, ([date, count]) => ({
    date,
    count,
  }));

  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(endDate.getMonth() - 6);

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-xl overflow-hidden">
      <h3 className="text-lg font-bold text-[var(--text)] mb-4">
        Interview Consistency
      </h3>

      <div className="custom-heatmap text-sm relative">
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={values}
          classForValue={(value: any) => {
            if (!value) return "color-empty";
            return `color-scale-${Math.min(value.count, 4)}`;
          }}
          tooltipDataAttrs={
            ((value: any) => ({
              "data-tooltip-id": "heatmap-tooltip",
              "data-tooltip-content":
                value && value.date
                  ? `${value.count} interview${
                      value.count > 1 ? "s" : ""
                    } on ${value.date}`
                  : "No interviews on this day",
            })) as any
          }
        />

        <Tooltip
          id="heatmap-tooltip"
          className="z-50 !bg-[var(--bg)] !border !border-[var(--border)] !text-[var(--text)] !text-xs shadow-lg"
        />
      </div>
    </div>
  );
}

export default ActivityHeatmap;
