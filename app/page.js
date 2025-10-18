import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text mb-4">
        Welcome to Product Manager
      </h1>
      <p className="text-gray-600 mb-6">
        🚀 Please log in first to access and manage your products — including creating, editing, and deleting them.
      </p>
      <Link
        href="/login"
        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
      >
        Login Now
      </Link>
    </div>

  );
}
