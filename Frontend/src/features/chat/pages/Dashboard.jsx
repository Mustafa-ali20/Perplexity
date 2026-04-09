import React from "react";
import { useSelector } from "react-redux";

const Dashboard = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  console.log(user);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
    <nav className="bg-slate-800/50 backdrop-blur border-b border-purple-500/20 px-6 py-4">
      <h1 className="text-2xl font-bold text-white">Perplexity</h1>
    </nav>
    <div className="flex h-[calc(100vh-80px)]">
      <button className="w-64 bg-slate-800/30 border-r border-purple-500/20 p-4">
        <aside className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-2 px-4 mb-4 transition">
          + New Chat
        </aside>
      </button>
    </div>
    <main>{children}</main>
    </div>
  );
};


export default Dashboard;
