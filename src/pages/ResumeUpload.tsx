import { useState } from "react";
import { uploadResume } from "../services/api.js";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar.js";
import { motion } from "framer-motion";

function ResumeUpload() {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File must be under 5MB");
      return;
    }

    setUploadFile(file);
    setError("");
  };

  const handleUpload = async () => {
    setError("");
    if (!uploadFile) {
      setError("Please select a PDF file.");
      return;
    }

    try {
      setLoading(true);
      const response = await uploadResume(uploadFile);

      if (response.status !== 200) {
        setError("Upload failed");
        return;
      }
      navigate("/onboarding");

    } catch (error: any) {
      setError(error?.response?.data?.error || "Something went wrong during upload");
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-70px)] flex items-center justify-center bg-[var(--bg)] px-6 py-12 relative overflow-hidden font-sans">
        
        {/* Ambient Background Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center z-10">
          
          {/* LEFT SIDE: Animated Timeline to fill the vacant space */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="hidden lg:flex flex-col space-y-10 pr-8"
          >
            <div>
                <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
                    Personalize your <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-[var(--accent)]">interview journey.</span>
                </motion.h2>
                <motion.p variants={itemVariants} className="text-[var(--text-muted)] text-lg leading-relaxed max-w-md">
                    Our AI doesn't ask generic questions. We analyze your unique background to conduct a highly realistic, tailored mock interview.
                </motion.p>
            </div>

            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[1.1rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[var(--accent)] before:to-[var(--surface)] before:opacity-30">
                
                {/* Step 1 */}
                <motion.div variants={itemVariants} className="relative flex items-start gap-6">
                    <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-bold shadow-[0_0_20px_rgba(170,59,255,0.4)] z-10 shrink-0 border-4 border-[var(--bg)]">
                        1
                    </div>
                    <div className="pt-1">
                        <h3 className="text-white font-bold text-xl mb-1">Upload Resume</h3>
                        <p className="text-[var(--text-muted)] text-sm">We securely extract your skills, projects, and work experience.</p>
                    </div>
                </motion.div>

                {/* Step 2 */}
                <motion.div variants={itemVariants} className="relative flex items-start gap-6 opacity-50">
                    <div className="w-10 h-10 rounded-full bg-[var(--surface)] border-2 border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] font-bold z-10 shrink-0">
                        2
                    </div>
                    <div className="pt-1">
                        <h3 className="text-white font-bold text-xl mb-1">Configure Target</h3>
                        <p className="text-[var(--text-muted)] text-sm">Select your dream company, role, and difficulty level.</p>
                    </div>
                </motion.div>

                {/* Step 3 */}
                <motion.div variants={itemVariants} className="relative flex items-start gap-6 opacity-50">
                    <div className="w-10 h-10 rounded-full bg-[var(--surface)] border-2 border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] font-bold z-10 shrink-0">
                        3
                    </div>
                    <div className="pt-1">
                        <h3 className="text-white font-bold text-xl mb-1">Face the AI</h3>
                        <p className="text-[var(--text-muted)] text-sm">Speak your answers and write real code in our Docker sandbox.</p>
                    </div>
                </motion.div>

            </div>
          </motion.div>

          {/* RIGHT SIDE: The Upload Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-lg mx-auto"
          >
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 sm:p-10 shadow-2xl shadow-black/50 relative overflow-hidden group">
              
              {/* Card internal subtle glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--accent)]/10 rounded-full blur-[80px] group-hover:bg-[var(--accent)]/20 transition-colors duration-500"></div>

              <div className="mb-10 text-center relative z-10">
                <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-blue-600 to-[var(--accent)] flex items-center justify-center text-white font-bold text-2xl shadow-[0_0_20px_rgba(59,130,246,0.4)] transform group-hover:scale-105 transition-transform duration-300">
                  📄
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  Upload Resume
                </h1>
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  PDF format only. Maximum 5MB.
                </p>
              </div>

              <div className="space-y-6 relative z-10">
                {/* Styled File Input / Dropzone Area */}
                <div className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 ${uploadFile ? 'border-[var(--success)] bg-[var(--success)]/5' : 'border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5'}`}>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  {!uploadFile ? (
                    <div className="flex flex-col items-center pointer-events-none">
                      <span className="text-4xl mb-4 opacity-80">📁</span>
                      <p className="text-base font-bold text-white mb-1">Click to browse</p>
                      <p className="text-xs text-[var(--text-muted)]">or drag and drop your file here</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center pointer-events-none">
                      <span className="text-4xl mb-4 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">✅</span>
                      <p className="text-base font-bold text-[var(--success)] mb-1">Ready to upload</p>
                      <p className="text-xs text-[var(--text-muted)] break-all px-4">{uploadFile.name}</p>
                      <p className="text-xs text-[var(--accent)] mt-5 underline decoration-dashed">Choose a different file</p>
                    </div>
                  )}
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-lg bg-[var(--danger)]/10 border border-[var(--danger)]/20 text-center">
                      <p className="text-sm font-medium text-[var(--danger)]">{error}</p>
                  </motion.div>
                )}

                <button
                  onClick={handleUpload}
                  disabled={loading || !uploadFile}
                  className="w-full rounded-xl bg-[var(--accent)] py-4 text-sm font-bold text-white transition-all hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(170,59,255,0.2)] hover:shadow-[0_0_25px_rgba(170,59,255,0.4)] disabled:shadow-none hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Parsing Resume...</span>
                    </>
                  ) : "Continue to Setup ➔"}
                </button>

              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </>
  );
}

export default ResumeUpload;
