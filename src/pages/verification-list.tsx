import { useState, useEffect } from "react";
import { FaIdCard, FaPassport, FaUserCheck, FaUserTimes } from "react-icons/fa";
import { MdCreditCard } from "react-icons/md";
import { supabase } from "@/lib/supabase";
import type { VerificationRecord } from "@/lib/supabase";
import Link from "next/link";

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
    case "id":
      return <FaIdCard className="text-purple-500" />;
    case "license":
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
  const [verifications, setVerifications] = useState<VerificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('verifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVerifications(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching verifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredVerifications = verifications.filter((verification) =>
    verification.user_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading verifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
          <button
            onClick={fetchVerifications}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Verification List</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all users who have completed the verification process.
            </p>
            {/* go to dashboard */}
            <Link href="/dashboard" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
              Verify User
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4">
          <input
            type="text"
            placeholder="Search by user ID..."
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
                        User ID
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
                    {filteredVerifications.map((verification) => (
                      <tr key={verification.id}>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {verification.user_id}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            {getIdTypeIcon(verification.id_type)}
                            <span className="capitalize">{verification.id_type.replace("_", " ")}</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-orange-500 h-2.5 rounded-full"
                                style={{ width: `${verification.verification_score * 100}%` }}
                              ></div>
                            </div>
                            <span className="ml-2">{(verification.verification_score * 100).toFixed(2)}%</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatDate(verification.verification_date)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              verification.status
                            )}`}
                          >
                            {getStatusIcon(verification.status)}
                            <span className="capitalize">{verification.status}</span>
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