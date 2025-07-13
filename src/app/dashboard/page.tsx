"use client";

import { useState, useEffect, useRef } from "react";
import { FaPlus } from "react-icons/fa6";
import { MdOutlineDateRange } from "react-icons/md";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

const tabs = [
  { label: "Todo", count: 8 },
  { label: "In Progress", count: 10 },
  { label: "Completed", count: 12 },
];
interface ProjectType {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  members: MemberType[];
}

interface MemberType {
  image: string | null;
}

export default function ProjectPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [activeTab, setActiveTab] = useState("Todo");
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const token = useRef<string>("");
  const fetchProjects = async (token: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/user-projects`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Failed to fetch");
      }
      setProjects(result.data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  const addnewproject = async () => {
    try {
      setError("");
      setLoading(true);
      if (!name || !description) {
        toast.error("Provide all details");
      }
      console.log(token);
      const projectRes = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/create-project`,
        { name, description },
        {
          headers: {
            Authorization: `Bearer ${token.current}`,
          },
        }
      );
      if (projectRes.data.status === 201) {
        toast.success(projectRes.data.message);
        setShowModal(false);
        setName("");
        setDescription("");
        fetchProjects(token.current);
      } else {
        setError("");
        toast.error(projectRes.data.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find((row) => row.startsWith("accessToken="));
    token.current = tokenCookie ? tokenCookie.split("=")[1] : "";
    if (!token.current) {
      router.push("/");
    } else {
      fetchProjects(token.current);
    }
  }, [router]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
      }
    };
    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);
  return (
    <div className="w-[92%] mx-auto my-4 px-2 sm:px-5 py-2 space-y-4 sm:space-y-5 ">
      <div className="text-2xl text-gray-200 font-bold">Project Dashboard</div>
      <div className="flex items-center justify-between">
        <h1 className="text-lg sm:text-2xl font-bold">
          Projects List <span>📌</span>
        </h1>
        <div className="flex items-center gap-4">
          {/* Avatars */}
          {/* <div className="flex -space-x-2">
            {[...Array(4)].map((_, i) => (
              <Image
                key={i}
                width={32}
                height={32}
                src={`/logo-nav.png`}
                alt={`user-${i}`}
                className="rounded-full border-2 border-white"
              />
            ))}
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 border-2 border-white">
              +4
            </div>
          </div> */}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 text-xs sm:text-sm bg-white shadow-lg border shadow-zinc-300 px-2 sm:px-4 py-2 rounded-md hover:bg-gray-50"
          >
            <FaPlus className="text-gray-500" />
            Add New
          </button>
        </div>
      </div>

      <div className="hidden sm:flex gap-6 border-b pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`relative text-sm pb-1 ${
              activeTab === tab.label
                ? "text-blue-600 font-medium border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
          >
            {tab.label}{" "}
            <span className="ml-1 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Projects */}
      {loading ? (
        <p className="text-gray-500 text-sm mt-10 font-medium">
          Loading projects...
        </p>
      ) : !projects || projects.length === 0 ? (
        <p className="text-gray-500 text-sm mt-10 font-medium">
          No projects found.
        </p>
      ) : error ? (
        <p className="text-red-500  text-sm mt-10 font-medium">
          Error: {error}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: ProjectType) => (
            <div
              key={project.id}
              className="bg-white py-3 px-4 sm:p-5 rounded-xl shadow-lg border  shadow-zinc-300 space-y-1"
            >
              <span className="inline-block text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600">
                {"General"}
              </span>
              <h3
                onClick={() => router.push(`/${project.name}/${project.id}`)}
                className="text-lg font-medium hover:text-gray-600 cursor-pointer hover:underline"
              >
                {project.name}
              </h3>
              <p className="text-sm text-gray-500">
                {project.description || "No description provided"}
              </p>

              <div className="flex items-center justify-between mt-4">
                <div className="flex -space-x-2">
                  {project.members
                    ?.slice(0, 3)
                    .map((member: MemberType, i: number) => (
                      <Image
                        key={i}
                        width={24}
                        height={24}
                        src={member.image ?? "/logo-nav.png"}
                        alt="avatar"
                        className="w-8 h-8 rounded-full border-2 border-white"
                      />
                    ))}
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <MdOutlineDateRange className="text-lg" />
                  {new Date(project.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-30 flex justify-center items-center z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg space-y-4"
          >
            <h2 className="text-xl font-bold text-gray-800">Create Project</h2>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project Name"
              className="w-full border px-4 py-2 rounded-md text-sm"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Project Description"
              className="w-full border px-4 py-2 rounded-md text-sm resize-none"
              rows={3}
            />

            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={addnewproject}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
