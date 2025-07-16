"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import toast from "react-hot-toast";
import { linkRepository } from "@/store/thunks/githubThunks";

interface LinkRepositoryModalProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
}

const LinkRepositoryModal = ({
  open,
  onClose,
  projectId,
}: LinkRepositoryModalProps) => {
  const [repoUrl, setRepoUrl] = useState("");
  const [repoName, setRepoName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async () => {
    if (!repoUrl || !repoName) {
      toast.error("Please enter both repository URL and name.");
      return;
    }

    setIsLoading(true);

    const resultAction = await dispatch(
      linkRepository({ repoName, repoUrl, projectId })
    );

    if (linkRepository.fulfilled.match(resultAction)) {
      toast.success("GitHub repository linked!");
      onClose();
      setRepoName("");
      setRepoUrl("");
    } else {
      toast.error(
        (resultAction.payload as string) || "Failed to link repository"
      );
    }

    setIsLoading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
        <h2 className="text-lg font-semibold mb-4">Link GitHub Repository</h2>

        <input
          type="text"
          placeholder="Enter GitHub Repository URL"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Enter Repository Name"
          value={repoName}
          onChange={(e) => setRepoName(e.target.value)}
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
            disabled={isLoading}
            className={`px-4 py-2 text-white rounded ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkRepositoryModal;
