import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

function LearningHub() {
  const navigate = useNavigate();

  const categories = [
    {
      id: "dsa",
      title: "Learning DSA",
      icon: "🧩",
      description: "Structured roadmaps and sheets (Striver A2Z, Blind 75) to master Data Structures and Algorithms.",
      color: "var(--accent)"
    },
    {
      id: "cp",
      title: "Learning CP",
      icon: "🏆",
      description: "Progressive level-wise Codeforces problems to build raw logic.",
      color: "var(--success)"
    },
    {
      id: "cs-core",
      title: "CS Core Fundamentals",
      icon: "🧠",
      description: "Curated resources for OOPS, DBMS, Operating Systems, and Computer Networks.",
      color: "var(--warning)"
    },
    {
      id: "system-design",
      title: "System Design",
      icon: "🏗️",
      description: "Learn to scale. High-level architecture breakdowns, caching, and load balancing concepts.",
      color: "var(--danger)"
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[var(--bg)] px-4 py-10">
        <div className="max-w-5xl mx-auto">
          
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-[var(--text)]">The Learning Hub</h1>
            <p className="text-[var(--text-muted)] mt-2">Structured roadmaps and curated resources to cure tutorial hell.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category) => (
              <div 
                key={category.id}
                onClick={() => navigate(`/learning/${category.id}`)}
                className="group cursor-pointer bg-[var(--surface)] border border-[var(--border)] p-8 rounded-2xl hover:border-[var(--accent)] transition-all relative overflow-hidden"
              >
                {/* A subtle glowing gradient in the background based on the card's color */}
                <div 
                  className="absolute -top-10 -right-10 w-32 h-32 blur-3xl opacity-10 rounded-full group-hover:opacity-20 transition-opacity"
                  style={{ backgroundColor: category.color }}
                ></div>

                <div className="text-4xl mb-4">{category.icon}</div>
                <h2 className="text-xl font-bold text-[var(--text)] mb-2">{category.title}</h2>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  {category.description}
                </p>
                
                <div className="mt-6 flex items-center text-sm font-bold" style={{ color: category.color }}>
                  Explore Roadmap <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}

export default LearningHub;
