import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

interface StatsData {
  totalUsers: number;
  totalVisits: number;
}

const rawUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const BACKEND_URL = rawUrl.replace(/\/$/, "");

export default function AnalyticsStats() {
  const [stats, setStats] = useState<StatsData>({ totalUsers: 0, totalVisits: 0 });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/analytics/stats`, {
            withCredentials: true
        });
        
        const data = response.data;
        setStats({
          totalUsers: data.totalUsers ?? 0,
          totalVisits: data.totalVisits ?? 0
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <div className="w-full max-w-[400px] h-[72px] bg-white/5 rounded-full animate-pulse border border-white/5"></div>
      </div>
    );
  }

  // Hide the component if there is no data to prevent awkward "0" states on launch
  if (stats.totalUsers === 0 && stats.totalVisits === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="mt-10 flex justify-center w-full px-4"
    >
      {/* SaaS Style Glass Strip */}
      <div className="relative flex flex-col sm:flex-row items-center divide-y sm:divide-y-0 sm:divide-x divide-white/10 rounded-3xl sm:rounded-full bg-[#0a0a0a]/60 border border-white/10 backdrop-blur-xl shadow-[0_0_40px_rgba(168,85,247,0.07)] overflow-hidden">
        
        {/* Subtle animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10 opacity-50 pointer-events-none"></div>

        {/* Engineers Joined Metric */}
        <div className="px-10 py-4 flex items-center gap-4 relative z-10 group w-full sm:w-auto justify-center cursor-default">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors duration-300 text-gray-400 group-hover:text-white">
            {/* Users SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <div className="text-left">
            <div className="text-2xl font-extrabold text-white leading-none mb-1">
              {stats.totalUsers.toLocaleString()}+
            </div>
            <div className="text-gray-400 text-[11px] font-bold uppercase tracking-widest">
              Engineers Joined
            </div>
          </div>
        </div>

        {/* Total Visits Metric */}
        <div className="px-10 py-4 flex items-center gap-4 relative z-10 group w-full sm:w-auto justify-center cursor-default">
          <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors duration-300 text-purple-400 group-hover:text-purple-300">
            {/* Lightning / Activity SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <div className="text-left">
            <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 leading-none mb-1">
              {stats.totalVisits.toLocaleString()}+
            </div>
            <div className="text-gray-400 text-[11px] font-bold uppercase tracking-widest">
              Total Visits
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
