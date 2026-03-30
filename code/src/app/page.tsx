import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to CoderPad</h1>
      <p className="text-lg text-gray-600 mb-8">
        Collaborative coding interviews made simple.
      </p>
      
      <div className="flex gap-4">
        <Link 
          href="/login" 
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Login
        </Link>
        <Link 
          href="/dashboard" 
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}