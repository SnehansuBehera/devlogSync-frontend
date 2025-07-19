import React, { useEffect } from "react";
import { eachDayOfInterval, subDays, format } from "date-fns";
import getColor from "@/helper/getColor";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchCommitsCount,
  fetchHeatmapData,
} from "@/store/thunks/dailyLogThunks";

// const commitsByDate: Record<string, number> = {
//   "2025-07-18": 2,
//   "2025-07-17": 5,
//   "2025-07-16": 0,
//   "2025-07-15": 3,
//   "2025-07-14": 1,
// };

const GridMap = ({ projectId }: { projectId: string }) => {
  const dispatch = useAppDispatch();
  const { commitData, loading, error, totalCommits } = useAppSelector(
    (state) => state.heatmap
  );

  useEffect(() => {
    if (projectId) {
      dispatch(fetchHeatmapData(projectId));
      dispatch(fetchCommitsCount(Number(projectId)));
    }
  }, [dispatch, projectId]);

  const today = new Date();
  const yearAgo = subDays(today, 365);
  const allDays = eachDayOfInterval({ start: yearAgo, end: today });
  const weeks = [];

  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
  }
  if (loading) return <div>Loading heatmap...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  return (
    <div className="bg-white rounded-lg shadow p-6 mt-4">
      <h2 className="text-lg font-semibold mb-2">
        {totalCommits} Contributions
      </h2>
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex">
          {weeks.map((week, i) => (
            <div key={i} className="flex flex-col space-y-1 mr-1">
              {week.map((date) => {
                const dateStr = format(date, "yyyy-MM-dd");
                const count = commitData[dateStr] || 0;
                return (
                  <div
                    key={dateStr}
                    title={`${dateStr}: ${count} commits`}
                    className={`w-3 h-3 sm:w-4 sm:h-4 rounded ${getColor(
                      count
                    )}`}
                  ></div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GridMap;
