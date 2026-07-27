import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getDSARoundQuestions, getAvailableCompanies } from "@/services/api"; 
import Navbar from "@/components/Navbar";

export default function DsaMockSetup() {
    const navigate = useNavigate();
    
    // State for dynamic companies
    const [companies, setCompanies] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    
    const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch dynamic companies from DB on mount
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await getAvailableCompanies();
                setCompanies(res.data.companies);
            } catch (err) {
                console.error("Failed to load companies:", err);
            } finally {
                setIsFetching(false);
            }
        };
        fetchCompanies();
    }, []);

    // Filter companies based on search
    const filteredCompanies = companies.filter(c => 
        c.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleStartArena = async () => {
        if (!selectedCompany) return;
        setIsLoading(true);
        setError(null);

        try {
            const response = await getDSARoundQuestions({ company: selectedCompany });
            const sessionId = response.data.sessionId;
            navigate(`/arena/${sessionId}`);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error || "Failed to generate assessment. Ensure there are enough questions for this company.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] font-sans flex flex-col text-white selection:bg-purple-500/30">
            <Navbar />

            <main className="flex-grow flex items-center justify-center p-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="max-w-2xl w-full bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8 md:p-12 shadow-[0_0_40px_rgba(168,85,247,0.05)] relative overflow-hidden flex flex-col max-h-[85vh]"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-blue-500"></div>

                    <div className="text-center mb-8 shrink-0">
                        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Configure Mock OA</h1>
                        <p className="text-[var(--text-muted)] text-sm md:text-base leading-relaxed">
                            You are about to enter a strict 90-minute online assessment. Select your target company below.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6 shrink-0 relative">
                        <input 
                            type="text" 
                            placeholder="Search companies (e.g., Amazon, Flipkart, Zomato)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3 pl-10 text-sm outline-none focus:border-purple-500 transition-colors"
                        />
                        <span className="absolute left-3 top-3.5 text-[var(--text-muted)]">🔍</span>
                    </div>

                    {/* Company Selection Grid (Scrollable) */}
                    <div className="mb-8 overflow-y-auto pr-2 custom-scrollbar flex-grow">
                        {isFetching ? (
                            <div className="flex items-center justify-center py-10 text-[var(--text-muted)]">
                                <div className="w-5 h-5 border-2 border-[var(--text-muted)] border-t-transparent rounded-full animate-spin mr-3"></div>
                                Loading available companies...
                            </div>
                        ) : filteredCompanies.length === 0 ? (
                            <div className="text-center py-10 text-[var(--text-muted)] text-sm">
                                No companies found matching "{searchQuery}"
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {filteredCompanies.map((companyName) => (
                                    <button
                                        key={companyName}
                                        onClick={() => setSelectedCompany(companyName)}
                                        className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all duration-200 ${
                                            selectedCompany === companyName 
                                            ? 'bg-purple-500/10 border-purple-500 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.2)] scale-105' 
                                            : 'bg-[var(--bg)] border-[var(--border)] text-[var(--text-muted)] hover:bg-white/5 hover:border-white/20'
                                        }`}
                                    >
                                        <span className="text-2xl">🏢</span>
                                        <span className="font-bold text-sm text-center">{companyName}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center font-medium shrink-0">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        onClick={handleStartArena}
                        disabled={!selectedCompany || isLoading}
                        className={`w-full py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-3 transition-all shrink-0 ${
                            !selectedCompany || isLoading
                            ? 'bg-[var(--bg)] border border-[var(--border)] text-[var(--text-muted)] cursor-not-allowed'
                            : 'bg-white text-black hover:bg-gray-200 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.02]'
                        }`}
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                Generating Environment...
                            </>
                        ) : (
                            "Enter the Arena ➔"
                        )}
                    </button>

                </motion.div>
            </main>
        </div>
    );
}
