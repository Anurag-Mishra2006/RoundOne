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

//  incorrect typings in react-calendar-heatmap 
const TypedCalendarHeatmap = CalendarHeatmap as unknown as React.ComponentType<{
  startDate: Date;
  endDate: Date;
  values: HeatmapValue[];
  classForValue?: (value: HeatmapValue | undefined) => string;
  tooltipDataAttrs?: (
    value: HeatmapValue | undefined
  ) => Record<string, string>;
}>;

// Is this a genuinely usable date (not null/undefined/epoch/invalid)?
function isValidDate(value: unknown): value is string | Date {
  if (!value) return false; // catches null, undefined, "", 0
  const d = new Date(value as string | Date);
  return !isNaN(d.getTime()) && d.getTime() !== 0;
}

// yyyy-mm-dd in LOCAL time (not UTC), so a day's activity lands on the
// day the user actually experienced it, not shifted by timezone.
function toLocalDateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Shape used internally while aggregating activity counts per day
type DayCounts = {
  interviews: number;
  dsa: number;
};

function ActivityHeatmap({ activities }: ActivityHeatmapProps) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(endDate.getMonth() - 6);

  // Step 1: aggregate real activity into a map, skipping any bad/missing dates
  const activityMap = new Map<string, DayCounts>();

  activities.forEach((activity) => {
    if (!isValidDate(activity.createdAt)) return; // skip null/invalid dates

    const parsed = new Date(activity.createdAt);
    const date = toLocalDateKey(parsed);

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

  //  pre-fill EVERY day in the visible range, not just days with
  // activity. This is the key fix — react-calendar-heatmap passes `null`
  // (no date info at all) to classForValue/tooltipDataAttrs for any day
  // missing from `values`, which is what causes "wrong"/epoch dates to
  // show up on hover for empty days. Giving every day a real entry means
  // the library always has a correct date to report, even for 0-activity days.
  const values: HeatmapValue[] = [];
  const cursor = new Date(startDate);
  cursor.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  while (cursor <= end) {
    const dateKey = toLocalDateKey(cursor);
    const entry = activityMap.get(dateKey);

    values.push({
      date: dateKey,
      interviews: entry?.interviews ?? 0,
      dsa: entry?.dsa ?? 0,
      count: (entry?.interviews ?? 0) + (entry?.dsa ?? 0),
    });

    cursor.setDate(cursor.getDate() + 1);
  }

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
            if (!value || value.count === 0) return "color-empty";

            if (value.interviews > 0 && value.dsa > 0) {
              return "color-mixed";
            }

            if (value.interviews > 0) {
              return `color-interview-${Math.min(value.interviews, 4)}`;
            }

            return `color-dsa-${Math.min(value.dsa, 4)}`;
          }}
          tooltipDataAttrs={(value) => {
            // value is now guaranteed to exist for every visible day,
            // so we can always show the correct date.
            if (!value) {
              return {
                "data-tooltip-id": "heatmap-tooltip",
                "data-tooltip-content": "No activity",
              };
            }

            const date = new Date(`${value.date}T00:00:00`).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              }
            );

            const interviewText =
              value.interviews > 0
                ? `${value.interviews} Interview${
                    value.interviews > 1 ? "s" : ""
                  }`
                : "";

            const dsaText =
              value.dsa > 0 ? `${value.dsa} DSA Solved` : "";

            const activityText = [interviewText, dsaText]
              .filter(Boolean)
              .join("\n");

            return {
              "data-tooltip-id": "heatmap-tooltip",
              "data-tooltip-content": activityText
                ? `${date}\n${activityText}`
                : `${date}\nNo activity`,
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
