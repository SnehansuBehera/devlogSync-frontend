"use client";

import React, { useState } from "react";

interface LinkRepositoryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (repoUrl: string) => void;
}

const LinkRepositoryModal = ({
  open,
  onClose,
  onSubmit,
}: LinkRepositoryModalProps) => {
  const [repoUrl, setRepoUrl] = useState("");

  const handleSubmit = () => {
    if (repoUrl.trim()) {
      onSubmit(repoUrl.trim());
      setRepoUrl("");
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
        <h2 className="text-lg font-semibold mb-4">Link GitHub Repository</h2>

        <input
          type="text"
          placeholder="Enter GitHub Repository URL"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex justify-end mt-6 gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkRepositoryModal;
