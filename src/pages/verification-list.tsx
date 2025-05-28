import { useState } from "react";
import { FaIdCard, FaPassport, FaUserCheck, FaUserTimes } from "react-icons/fa";
import { MdCreditCard } from "react-icons/md";

// Mock data - Replace with actual data from your API
const mockUsers = [
  {
    id: 1,
    username: "john_doe",
    idType: "passport",
    verificationScore: 95,
    verificationDate: "2024-03-15",
    status: "verified",
  },
  {
    id: 2,
    username: "jane_smith",
    idType: "id_card",
    verificationScore: 88,
    verificationDate: "2024-03-14",
    status: "pending",
  },
  {
    id: 3,
    username: "mike_wilson",
    idType: "driving_license",
    verificationScore: 92,
    verificationDate: "2024-03-13",
    status: "verified",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "verified":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "verified":
      return <FaUserCheck className="text-green-500" />;
    case "pending":
      return <FaUserTimes className="text-yellow-500" />;
    case "rejected":
      return <FaUserTimes className="text-red-500" />;
    default:
      return null;
  }
};

const getIdTypeIcon = (type: string) => {
  switch (type) {
    case "passport":
      return <FaPassport className="text-blue-500" />;
    case "id_card":
      return <FaIdCard className="text-purple-500" />;
    case "driving_license":
      return <MdCreditCard className="text-green-500" />;
    default:
      return null;
  }
};

// Format date consistently
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
};

export default function VerificationList() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = mockUsers.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Verification List</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all users who have completed the verification process.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4">
          <input
            type="text"
            placeholder="Search by username..."
            className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Username
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        ID Type
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Verification Score
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Verification Date
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {user.username}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            {getIdTypeIcon(user.idType)}
                            <span className="capitalize">{user.idType.replace("_", " ")}</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-orange-500 h-2.5 rounded-full"
                                style={{ width: `${user.verificationScore}%` }}
                              ></div>
                            </div>
                            <span className="ml-2">{user.verificationScore}%</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatDate(user.verificationDate)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              user.status
                            )}`}
                          >
                            {getStatusIcon(user.status)}
                            <span className="capitalize">{user.status}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 