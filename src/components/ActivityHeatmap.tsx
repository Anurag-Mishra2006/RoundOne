import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import { Tooltip } from "react-tooltip";
import "react-calendar-heatmap/dist/styles.css";
import "react-tooltip/dist/react-tooltip.css";

interface Activity {
  createdAt: string | Date;
  type: "interview" | "dsa";
}

interface ActivityHeatmapProps {
  activities: Activity[];
}

interface HeatmapValue {
  date: string;
  interviews: number;
  dsa: number;
  count: number;
}

// Fix incorrect typings in react-calendar-heatmap v1.10.0
const TypedCalendarHeatmap = CalendarHeatmap as unknown as React.ComponentType<{
  startDate: Date;
  endDate: Date;
  values: HeatmapValue[];
  classForValue?: (value: HeatmapValue | undefined) => string;
  tooltipDataAttrs?: (
    value: HeatmapValue | undefined
  ) => Record<string, string>;
}>;

function ActivityHeatmap({ activities }: ActivityHeatmapProps) {
  const activityMap = new Map<
    string,
    {
      interviews: number;
      dsa: number;
    }
  >();

  activities.forEach((activity) => {
    const date = new Date(activity.createdAt).toISOString().split("T")[0];

    if (!activityMap.has(date)) {
      activityMap.set(date, {
        interviews: 0,
        dsa: 0,
      });
    }

    const current = activityMap.get(date)!;

    if (activity.type === "interview") {
      current.interviews++;
    } else {
      current.dsa++;
    }
  });

  const values: HeatmapValue[] = Array.from(activityMap.entries()).map(
    ([date, value]) => ({
      date,
      interviews: value.interviews,
      dsa: value.dsa,
      count: value.interviews + value.dsa,
    })
  );

  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(endDate.getMonth() - 6);

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-xl overflow-hidden">
      <h3 className="text-lg font-bold text-[var(--text)] mb-4">
        Activity Consistency
      </h3>

      <div className="custom-heatmap text-sm relative">
        <TypedCalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={values}
          classForValue={(value) => {
            if (!value) return "color-empty";

            if (value.interviews > 0 && value.dsa > 0) {
              return "color-mixed";
            }

            if (value.interviews > 0) {
              return `color-interview-${Math.min(value.interviews, 4)}`;
            }

            return `color-dsa-${Math.min(value.dsa, 4)}`;
          }}
          tooltipDataAttrs={(value) => {
            if (!value) {
              return {
                "data-tooltip-id": "heatmap-tooltip",
                "data-tooltip-content": "No activity",
              };
            }

            const date = new Date(value.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            const interviewText =
              value.interviews > 0
                ? `${value.interviews} Interview${
                    value.interviews > 1 ? "s" : ""
                  }`
                : "";

            const dsaText =
              value.dsa > 0 ? `${value.dsa} DSA Solved` : "";

            return {
              "data-tooltip-id": "heatmap-tooltip",
              "data-tooltip-content": [date, interviewText, dsaText]
                .filter(Boolean)
                .join("\n"),
            };
          }}
        />

        <Tooltip
          id="heatmap-tooltip"
          className="z-50 !bg-[var(--bg)] !border !border-[var(--border)] !text-[var(--text)] !text-xs whitespace-pre-line shadow-lg"
        />
      </div>
    </div>
  );
}

export default ActivityHeatmap;
