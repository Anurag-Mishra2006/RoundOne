import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { motion, type Variants } from "framer-motion";

function LearningHub() {
  const navigate = useNavigate();

  const categories = [
    {
      id: "dsa",
      title: "Learning DSA",
      icon: (
        // 3D Cube / Puzzle SVG
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
        </svg>
      ),
      description: "Structured roadmaps and sheets (Striver A2Z, Blind 75) to master Data Structures and Algorithms.",
      color: "var(--accent)",
      bgLight: "rgba(168, 85, 247, 0.1)", // Purple tint
    },
    {
      id: "cp",
      title: "Learning CP",
      icon: (
        // Trophy SVG
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
        </svg>
      ),
      description: "Progressive level-wise Codeforces problems to build raw, unbeatable coding logic.",
      color: "var(--success)",
      bgLight: "rgba(34, 197, 94, 0.1)", // Green tint
    },
    {
      id: "cs-core",
      title: "CS Core Fundamentals",
      icon: (
        // CPU Microchip SVG
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z" />
        </svg>
      ),
      description: "Curated resources for OOPS, DBMS, Operating Systems, and Computer Networks.",
      color: "var(--warning)",
      bgLight: "rgba(234, 179, 8, 0.1)", // Yellow tint
    },
    {
      id: "system-design",
      title: "System Design",
      icon: (
        // Server Stack SVG
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
        </svg>
      ),
      description: "Learn to scale. High-level architecture breakdowns, caching, and load balancing concepts.",
      color: "var(--danger)",
      bgLight: "rgba(239, 68, 68, 0.1)", // Red tint
    }
  ];

  // Framer Motion Animation Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] font-sans flex flex-col relative overflow-hidden selection:bg-purple-500/30">
      
      {/* --- AMBIENT BACKGROUND --- */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)', backgroundSize: '24px 24px', maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)' }} />
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none z-0"></div>

      <div className="relative z-20">
        <Navbar />
      </div>

      <main className="flex-grow px-4 py-12 relative z-10">
        <div className="max-w-5xl mx-auto">
          
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-semibold uppercase tracking-widest backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                {/* Book Open SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
                Curriculum
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">The Learning Hub</h1>
            <p className="text-[var(--text-muted)] mt-4 text-lg max-w-2xl mx-auto">Structured roadmaps and curated resources to cure tutorial hell and build a FAANG-level foundation.</p>
          </motion.div>

          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category) => (
              <motion.div 
                variants={itemVariants}
                key={category.id}
                onClick={() => navigate(`/learning/${category.id}`)}
                className="group cursor-pointer bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden"
                style={{ hover: { borderColor: category.color } } as any} // Fallback for border color
              >
                {/* A subtle glowing gradient in the background based on the card's color */}
                <div 
                  className="absolute -top-10 -right-10 w-40 h-40 blur-[50px] opacity-20 rounded-full group-hover:opacity-40 transition-opacity duration-500"
                  style={{ backgroundColor: category.color }}
                ></div>

                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border transition-colors duration-300"
                  style={{ backgroundColor: category.bgLight, color: category.color, borderColor: `${category.color}30` }}
                >
                  {category.icon}
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-white transition-colors">{category.title}</h2>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6 h-[40px]">
                  {category.description}
                </p>
                
                <div className="mt-8 flex items-center text-sm font-bold uppercase tracking-wider transition-colors pt-6 border-t border-white/5" style={{ color: category.color }}>
                  Explore Roadmap 
                  {/* Arrow Right SVG replacing → */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                  </svg>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </main>
    </div>
  );
}

export default LearningHub;
