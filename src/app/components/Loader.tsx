"use client";

import React from "react";

const Loader = ({ size = 40, color = "border-blue-500" }) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full border-4 ${color} border-t-transparent`}
        style={{
          width: size,
          height: size,
        }}
      />
    </div>
  );
};

export default Loader;
