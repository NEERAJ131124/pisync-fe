"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function PiSyncDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("devices");
  const [devices, setDevices] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDevices = async () => {
    setLoading(true);
    const res = await axios.get(api.devices.getAll());
    setDevices(res.data);
    setLoading(false);
  };

  const fetchErrors = async () => {
    const res = await axios.get(api.errors.getAll());
    setErrors(res.data);
  };

  const triggerSync = async (deviceId) => {
    await axios.post(api.devices.sync(deviceId));
    fetchDevices();
  };

  const handleRefresh = async () => {
    const res = await axios.post(api.refresh());
    setDevices(res.data.devices);
    setErrors(res.data.errors);
  };

  useEffect(() => {
    fetchDevices();
    fetchErrors();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const renderSyncStatus = (status) => {
    switch (status) {
      case "success":
        return "✅ Success";
      case "failed":
        return "❌ Failed";
      case "pending":
        return "⏳ Pending";
      default:
        return status;
    }
  };

  const logoutHandler = async () => {
    router.push('/');
  };

  return (
    <div className="p-6">
      <div className="bg-red-900 text-white font-bold p-3 mb-6 shadow-md">
        PiSync Admin Dashboard
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-10">
          <button
            onClick={() => setActiveTab("devices")}
            className={`font-semibold ${
              activeTab === "devices" ? "underline" : ""
            }`}
          >
            Device Management
          </button>
          <button
            onClick={() => setActiveTab("errors")}
            className={`font-semibold ${
              activeTab === "errors" ? "underline" : ""
            }`}
          >
            Recent Errors
          </button>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleRefresh}
            className="text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
          <button className="text-gray-600 hover:text-gray-900 cursor-pointer" onClick={logoutHandler}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>

      {activeTab === "devices" && (
        <Card>
          <CardContent className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-left">Device ID</th>
                  <th className="border px-4 py-2 text-left">Last Sync Time</th>
                  <th className="border px-4 py-2 text-left">Sync Status</th>
                  <th className="border px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((device) => (
                  <tr key={device.id} className="border-b hover:bg-gray-50">
                    <td className="border px-4 py-2">{device.id}</td>
                    <td className="border px-4 py-2">
                      {formatDate(device.lastSync)}
                    </td>
                    <td className="border px-4 py-2">
                      {renderSyncStatus(device.status)}
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => triggerSync(device.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md transition-colors"
                        disabled={loading}
                      >
                        {loading ? "Syncing..." : "Sync Now"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {activeTab === "errors" && (
        <Card>
          <CardContent className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-left">Device ID</th>
                  <th className="border px-4 py-2 text-left">Error Message</th>
                  <th className="border px-4 py-2 text-left">Last Attempt</th>
                </tr>
              </thead>
              <tbody>
                {errors.map((err) => (
                  <tr key={err.deviceId} className="border-b hover:bg-gray-50">
                    <td className="border px-4 py-2">{err.deviceId}</td>
                    <td className="border px-4 py-2">{err.message}</td>
                    <td className="border px-4 py-2">{formatDate(err.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      <div className="text-center text-xs mt-4">&lt;Pagination &gt;</div>
    </div>
  );
}
