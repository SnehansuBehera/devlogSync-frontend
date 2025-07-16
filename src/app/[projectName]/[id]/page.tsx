"use client";

import { getTime } from "@/helper/getTime";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { RiGithubLine } from "react-icons/ri";
import LinkRepositoryModal from "@/app/components/LinkRepoModal";

interface ProjectType {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  members: MemberType[];
}

interface MemberType {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  image: string | null;
  isActive: boolean;
  isAdmin: boolean;
  isVerified: boolean;
  createdAt: string;
  accessToken: string;
  githubToken: string | null;
  githubUsername: string | null;
}

const Project = () => {
  const token = useRef<string>("");
  const router = useRouter();
  const params = useParams();
  const [isRepoModalOpen, setIsRepoModalOpen] = useState(false);

  const projectId = params?.id as string;

  const [project, setProject] = useState<ProjectType | null>(null);
  console.log(project);
  const fetchProjectDetails = async (token: string, projectId: string) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/project/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data && res.data.data) {
        setProject(res.data.data);
      } else {
        toast.error("Project not found");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Something went wrong while fetching project");
    }
  };
  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find((row) => row.startsWith("accessToken="));
    token.current = tokenCookie ? tokenCookie.split("=")[1] : "";

    if (!token.current) {
      router.push("/");
    } else if (projectId) {
      fetchProjectDetails(token.current, projectId);
    }
  }, [router, projectId]);
  return (
    <div className="w-[88%] sm:w-[90%] mx-auto mt-4 px-2 sm:px-5 py-2">
      {/* Main Menu */}
      <div className="flex justify-between items-center">
        <h2 className="text-xs font-semibold text-zinc-500">
          Project &gt; <span className="text-zinc-700">{project?.name}</span>
        </h2>
        <span className="text-xs text-gray-500">
          Last update on {getTime(project?.updatedAt || "")}
        </span>
      </div>
      {/* Header Section */}
      <div className="mt-2">
        <h1 className="text-2xl font-bold text-gray-800">{project?.name}</h1>
        <div className="flex justify-between items-center mt-2">
          {/* Avatars */}
          <div className="flex items-center space-x-[-10px]">
            {project?.members?.slice(0, 3).map((member, index) => (
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
            {project?.members && project.members.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-gray-300 text-xs flex items-center justify-center border-2 border-white z-0">
                +{project.members.length - 5}
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
            <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs md:text-sm font-medium hover:bg-blue-700 transition">
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
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex overflow-x-auto no-scrollbar space-x-4 mb-4">
              {[
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ].map((month) => (
                <button
                  key={month}
                  className={`px-3 py-1 rounded-full text-sm ${
                    month === "Aug"
                      ? "bg-blue-100 text-blue-800"
                      : "text-gray-600"
                  }`}
                >
                  {month}
                </button>
              ))}
            </div>

            <div className="mb-2">
              <p className="text-sm text-gray-600">
                Issues, merge requests, pushes, and comments
              </p>
            </div>

            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">None</span>
              <div className="flex space-x-1">
                <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
              </div>
              <span className="text-sm text-gray-500 ml-2">● ● ● 30+</span>
            </div>
          </div>
        </div>

        {/* Transactions Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Transactions</h2>
          <p className="text-sm text-gray-600 mb-4">
            Lorem ipsum dolor sit amet, consectetur adipis.
          </p>

          <div className="overflow-x-auto">
            {/* Sticky Table Header */}
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount & Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Merchant
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
            </table>

            {/* Scrollable Table Body */}
            <div className="max-h-64 overflow-y-auto no-scrollbar">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    {
                      status: "Completed",
                      desc: "Visa card **** 4831 Card payment",
                      amount: "$182.94 Jan 17, 2022",
                      merchant: "Amazon",
                    },
                    {
                      status: "Completed",
                      desc: "Mastercard **** 6442 Card payment",
                      amount: "$99.00 Jan 17, 2022",
                      merchant: "Facebook",
                    },
                    {
                      status: "Pending",
                      desc: "Account ****882 Bank payment",
                      amount: "$249.94 Jan 17, 2022",
                      merchant: "Netflix",
                    },
                    {
                      status: "Canceled",
                      desc: "Amex card **** 5666 Card payment",
                      amount: "$199.24 Jan 17, 2022",
                      merchant: "Amazon Prime",
                    },
                    {
                      status: "Canceled",
                      desc: "Amex card **** 5666 Card payment",
                      amount: "$199.24 Jan 17, 2022",
                      merchant: "Amazon Prime",
                    },
                    {
                      status: "Canceled",
                      desc: "Amex card **** 5666 Card payment",
                      amount: "$199.24 Jan 17, 2022",
                      merchant: "Amazon Prime",
                    },
                    {
                      status: "Canceled",
                      desc: "Amex card **** 5666 Card payment",
                      amount: "$199.24 Jan 17, 2022",
                      merchant: "Amazon Prime",
                    },
                    {
                      status: "Canceled",
                      desc: "Amex card **** 5666 Card payment",
                      amount: "$199.24 Jan 17, 2022",
                      merchant: "Amazon Prime",
                    },
                  ].map((txn, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            txn.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : txn.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {txn.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {txn.desc}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {txn.amount}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {txn.merchant}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        **
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="border-t border-gray-200 my-6"></div>

          {/* Recent Customers Section */}
          <h2 className="text-lg font-semibold mb-4">Recent Customers</h2>
          <p className="text-sm text-gray-600 mb-4">
            Lorem ipsum dolor sit ametis.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium">Bennie Wilson</h3>
              <a
                href="https://www.bennie.wil"
                className="text-blue-600 text-sm"
              >
                lavsonbenn@gmail.com
              </a>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium">Robert Lane</h3>
              <a
                href="https://robertse@gmail.com"
                className="text-blue-600 text-sm"
              >
                robertse@gmail.com
              </a>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium">Jane Cooper</h3>
              <a
                href="https://jnecooper@gmail.com"
                className="text-blue-600 text-sm"
              >
                jnecooper@gmail.com
              </a>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium">Martin Russell</h3>
              <a
                href="https://martinruss@gmail.com"
                className="text-blue-600 text-sm"
              >
                martinruss@gmail.com
              </a>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium">$11.234 Austin</h3>
              <a
                href="https://www.newyork.com"
                className="text-blue-600 text-sm"
              >
                $11.159 NewYork
              </a>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium">$10.483 Toledo</h3>
              <a
                href="https://www.naperville.com"
                className="text-blue-600 text-sm"
              >
                $9.084 Naperville
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Activity Graph Section */}
      <LinkRepositoryModal
        open={isRepoModalOpen}
        onClose={() => setIsRepoModalOpen(false)}
        projectId={projectId}
      />
    </div>
  );
};

export default Project;
