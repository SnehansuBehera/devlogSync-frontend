"use client";

import { getTime } from "@/helper/getTime";
// import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { RiGithubLine } from "react-icons/ri";
import LinkRepositoryModal from "@/app/components/LinkRepoModal";
import InviteMemberModal from "@/app/components/InviteMemberModal";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjectCommits,
  fetchUnexportedLogs,
} from "@/store/thunks/githubThunks";
import { RootState, AppDispatch } from "@/store";
import { generateSummaryAndSendEmail } from "@/store/thunks/summaryThunks";
import GridMap from "@/app/components/GridMap";
import { fetchProjectById } from "@/store/thunks/projectThunks";

// interface ProjectType {
//   id: number;
//   name: string;
//   description: string;
//   createdAt: string;
//   updatedAt: string;
//   userId: number;
//   members: MemberType[];
// }

// interface MemberType {
//   id: number;
//   email: string;
//   password: string;
//   firstName: string;
//   lastName: string;
//   username: string;
//   image: string | null;
//   isActive: boolean;
//   isAdmin: boolean;
//   isVerified: boolean;
//   createdAt: string;
//   accessToken: string;
//   githubToken: string | null;
//   githubUsername: string | null;
// }

const Project = () => {
  const router = useRouter();
  const params = useParams();
  const [isRepoModalOpen, setIsRepoModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [exportTime, setExportTime] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { currentProject } = useSelector((state: RootState) => state.project);

  const { commits, logs, loading } = useSelector(
    (state: RootState) => state.github
  );
  const projectId = params?.id as string;
  // console.log(commits);
  // const [project, setProject] = useState<ProjectType | null>(null);
  // console.log(project);

  const handleExportLog = async (date: string) => {
    if (!projectId) {
      toast.error("Missing token or project ID");
      return;
    }
    toast.error(date);
    dispatch(generateSummaryAndSendEmail({ projectId, date }))
      .unwrap()
      .then(() => {
        toast.success("Daily report exported & emailed successfully!");
        dispatch(fetchUnexportedLogs({ projectId }));
      })
      .catch((err: string) => {
        toast.error(err || "Failed to export report");
      });
  };

  // const fetchProjectDetails = async (token: string, projectId: string) => {
  //   try {
  //     const res = await axios.get(
  //       `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/project/${projectId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     if (res.data && res.data.data) {
  //       setProject(res.data.data);
  //     } else {
  //       toast.error("Project not found");
  //     }
  //   } catch (error) {
  //     console.error("Fetch error:", error);
  //     toast.error("Something went wrong while fetching project");
  //   }
  // };

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const currentHour = now.getHours();
      setExportTime(currentHour < 19);
    };
    checkTime();

    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const initializeProjectData = async () => {
      const token = localStorage.getItem("accessToken") || "";
      if (!token) {
        router.push("/");
        return;
      }

      if (!projectId) return;
      dispatch(fetchProjectById(projectId));
      const today = new Date().toISOString().split("T")[0];
      dispatch(fetchProjectCommits({ projectId, date: today }));
      dispatch(fetchUnexportedLogs({ projectId }));
    };

    initializeProjectData();
  }, [projectId, router, dispatch]);

  return (
    <div className="w-[88%] sm:w-[90%] mx-auto mt-4 px-2 sm:px-5 py-2">
      {/* Main Menu */}
      <div className="flex justify-between items-center">
        <h2 className="text-xs font-semibold text-zinc-500">
          Project &gt;{" "}
          <span className="text-zinc-700">{currentProject?.name}</span>
        </h2>
        <span className="text-xs text-gray-500">
          Last update on {getTime(currentProject?.updatedAt || "")}
        </span>
      </div>
      {/* Header Section */}
      <div className="mt-2">
        <h1 className="text-2xl font-bold text-gray-800">
          {currentProject?.name}
        </h1>
        <div className="flex justify-between items-center mt-2">
          {/* Avatars */}
          <div className="flex items-center space-x-[-10px]">
            {currentProject?.members?.slice(0, 3).map((member, index) => (
              <Image
                key={member.id}
                src={
                  member.image ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${member.username}`
                }
                alt={member.username}
                className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-white"
                style={{ zIndex: 10 - index }}
                width={100}
                height={100}
              />
            ))}
            {currentProject?.members && currentProject.members.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-gray-300 text-xs flex items-center justify-center border-2 border-white z-0">
                +{currentProject.members.length - 5}
              </div>
            )}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-3">
            {/* Board View Button */}
            <button
              onClick={() => setIsRepoModalOpen(true)}
              className="flex items-center px-2 py-1 text-xs md:text-sm border border-blue-400 rounded-md text-blue-600 bg-white hover:bg-gray-100 gap-1"
            >
              <RiGithubLine className="text-sm text-blue-600" />
              <p>Link Repository</p>
            </button>

            {/* Invite Button */}
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs md:text-sm font-medium hover:bg-blue-700 transition"
            >
              + Invite Member
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 my-4"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Project Stats Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Project Stats</h2>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">
              04 Days 19 Feb, 2023 ~ 22 Feb, 2023
            </span>
            <span className="text-sm font-medium">February</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-600 mb-1">Inquiries</h3>
              <p className="text-xl font-bold">28</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-600 mb-1">Completion Rate</h3>
              <p className="text-xl font-bold">85%</p>
            </div>
          </div>

          {/* Calendar */}
          <div className="mb-2">
            <div className="flex justify-between text-sm font-medium mb-2">
              <span>18 Feb, 2023</span>
              <span>22 Feb, 2023</span>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              <div className="py-2">M</div>
              <div className="py-2">T</div>
              <div className="py-2">W</div>
              <div className="py-2">T</div>
              <div className="py-2">F</div>
              <div className="py-2">S</div>
              <div className="py-2">S</div>

              {[1, 2, 3, 4, 5, 6].map((day) => (
                <div key={`week1-${day}`} className="py-2 text-gray-400">
                  {day}
                </div>
              ))}

              {[7, 8, 9, 10, 11, 12, 13].map((day) => (
                <div key={`week2-${day}`} className="py-2 text-gray-400">
                  {day}
                </div>
              ))}

              {[14, 15, 16, 17, 18, 19, 20].map((day) => (
                <div
                  key={`week3-${day}`}
                  className={`py-2 ${
                    day >= 18 && day <= 22
                      ? "bg-blue-100 rounded-full font-medium"
                      : ""
                  }`}
                >
                  {day}
                </div>
              ))}

              {[21, 22, 23, 24, 25, 26, 27].map((day) => (
                <div
                  key={`week4-${day}`}
                  className={`py-2 ${
                    day >= 18 && day <= 22
                      ? "bg-blue-100 rounded-full font-medium"
                      : ""
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          <GridMap projectId={projectId} />
        </div>

        {/* Transactions Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold mb-1">View Logs</h2>
            <button
              onClick={() =>
                handleExportLog(new Date().toISOString().split("T")[0])
              }
              disabled={exportTime}
              className={`rounded-md px-4 py-2 text-white text-sm font-medium transition ${
                exportTime
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Export Logs
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Your daily loga are availabale here.
          </p>

          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">
              GitHub Commits (Today)
            </h2>

            {loading ? (
              <p className="text-sm text-gray-500">Loading commits...</p>
            ) : commits.length === 0 ? (
              <p className="text-sm text-gray-500">
                No commits found for today.
              </p>
            ) : (
              <div className="overflow-x-auto">
                {/* Sticky Table Header */}
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Commit Time
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Message
                      </th>
                    </tr>
                  </thead>
                </table>

                {/* Scrollable Table Body */}
                <div className="max-h-64 overflow-y-auto no-scrollbar">
                  <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="bg-white divide-y divide-gray-200">
                      {commits.map((commit) => (
                        <tr key={commit.id}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {new Date(commit.time).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {commit.message}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 my-6"></div>
          <h2 className="text-lg font-semibold mb-1">Unexported Logs</h2>
          <p className="text-sm text-gray-600 mb-4">
            Your unexported loga are availabale here.
          </p>
          {loading ? (
            <p className="text-sm text-gray-500">Loading logs...</p>
          ) : logs?.length === 0 ? (
            <p className="text-sm text-gray-500">No unexported logs found.</p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto no-scrollbar">
              {logs?.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md px-4 py-2"
                >
                  <span className="text-sm text-gray-800">
                    {new Date(log.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <button
                    onClick={() =>
                      handleExportLog(
                        new Date(log.date).toISOString().split("T")[0]
                      )
                    }
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Export
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Activity Graph Section */}
      <LinkRepositoryModal
        open={isRepoModalOpen}
        onClose={() => setIsRepoModalOpen(false)}
        projectId={parseInt(projectId, 10)}
      />
      {isInviteModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow p-4 w-[90%] sm:w-[400px]">
            <InviteMemberModal projectId={parseInt(projectId, 10)} />
            <button
              onClick={() => setIsInviteModalOpen(false)}
              className="text-sm text-gray-500 mt-2 hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Project;
