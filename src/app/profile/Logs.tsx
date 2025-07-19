"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTotalCommits,
  fetchTodayCommits,
  fetchWorkingDays,
} from "@/store/thunks/logThunks";
import { RootState, AppDispatch } from "@/store";

const Logs = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { totalCommits, todayCommits, workingDays, loading } = useSelector(
    (state: RootState) => state.stats
  );

  useEffect(() => {
    dispatch(fetchTotalCommits());
    dispatch(fetchTodayCommits());
    dispatch(fetchWorkingDays());
  }, [dispatch]);

  if (loading) {
    return (
      <p className="text-center font-bold text-zinc-500 mt-10">Loading...</p>
    );
  }

  return (
    <div className="mt-4 md:mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white py-6 md:py-10 px-4 rounded-lg shadow-lg text-center ">
        <h1 className="text-2xl font-bold text-zinc-700 mb-3 md:mb-5">
          {totalCommits}
        </h1>
        <p className="text-lg font-medium text-zinc-500">Total Contributions</p>
      </div>
      <div className="bg-white py-6 md:py-10 px-4 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-zinc-700 mb-3 md:mb-5">
          {todayCommits}
        </h1>
        <p className="text-lg font-medium text-zinc-500">
          Total Commits of the day
        </p>
      </div>
      <div className="bg-white py-6 md:py-10 px-4 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-zinc-700 mb-3 md:mb-5">
          {workingDays}
        </h1>
        <p className="text-lg font-medium text-zinc-500">Total Working Days</p>
      </div>
    </div>
  );
};

export default Logs;
