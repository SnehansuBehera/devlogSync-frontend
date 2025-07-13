"use client";

import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Calendar = ({
  selected,
  onChange,
  className,
}: {
  selected?: Date;
  onChange?: (date: Date) => void;
  className?: string;
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(selected || new Date());
  const handleDateClick = (date: Date) => {
    setCurrentDate(date);
    onChange?.(date);
  };
  return (
    <div className={cn("border rounded-md p-4 w-full", className)}>
      <p className="text-center font-semibold">{currentDate.toDateString()}</p>
      <div className="mt-4 text-center">
        <button
          className="bg-muted px-4 py-2 rounded"
          onClick={() => handleDateClick(new Date())}
        >
          Today
        </button>
      </div>
    </div>
  );
};

export { Calendar };
