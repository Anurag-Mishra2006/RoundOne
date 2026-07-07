import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { learningData } from "../data/learningSheet";
import { getProgress, toggleProgress } from "@/services/api";

function LearningSheet() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const data = categoryId ? learningData[categoryId] : null;

  // Track which sheet in the category is currently active (e.g., Striver vs Blind 75)
  const [activeSheetId, setActiveSheetId] = useState<string>("");
  const [sheetData, setSheetData] = useState<any>(null);

  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [loadingSheet, setLoadingSheet] = useState(true);
  
  const [expandedLectures, setExpandedLectures] = useState<Record<string, boolean>>({});

  // 1. Set the initial active sheet when the page loads
  useEffect(() => {
    if (!data) {
      navigate("/learning");
      return;
    }
    setActiveSheetId(data.sheets[0].id);
  }, [data, navigate]);

  // 2. Fetch the JSON file and the Database Progress whenever the active sheet changes
  useEffect(() => {
    if (!activeSheetId) return;

    const fetchSheetAndProgress = async () => {
      setLoadingSheet(true);
      setLoadingProgress(true);
      
      try {
        // Fetch the massive JSON file from our public folder!
        const sheetResponse = await fetch(`/data/sheets/${activeSheetId}.json`);
        if (sheetResponse.ok) {
            const json = await sheetResponse.json();
            setSheetData(json);
        } else {
            console.error("JSON file not found in public/data/sheets/");
            setSheetData(null);
        }

        // Fetch user progress from PostgreSQL
        const progressResponse = await getProgress(activeSheetId);
        setCompletedTasks(progressResponse.data.completedTasks ?? []);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoadingSheet(false);
        setLoadingProgress(false);
      }
    };

    fetchSheetAndProgress();
  }, [activeSheetId]);

  const toggleLecture = (lectureId: string) => {
    setExpandedLectures((prev) => ({ ...prev, [lectureId]: !prev[lectureId] }));
  };

  const handleToggleTask = async (taskId: string) => {
    const isCompleted = completedTasks.includes(taskId);
    setCompletedTasks((prev) => isCompleted ? prev.filter((id) => id !== taskId) : [...prev, taskId]);

    try {
      await toggleProgress({ sheetId: activeSheetId, taskId });
    } catch (error) {
      console.error("Backend failed to save", error);
      setCompletedTasks((prev) => isCompleted ? [...prev, taskId] : prev.filter((id) => id !== taskId));
    }
  };

  if (!data) return null;

  const safeCompletedTasks = completedTasks ?? [];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0d0d0d] px-4 py-10 font-sans text-gray-200">
        <div className="mx-auto max-w-6xl">
          
          <div className="mb-6">
            <button onClick={() => navigate("/learning")} className="text-gray-500 hover:text-gray-300 text-sm font-medium mb-4 flex items-center gap-2 transition-colors">
              ← Back to Hub
            </button>
            <h1 className="mb-2 text-3xl font-bold text-white">{data.title}</h1>
            <p className="text-sm text-gray-400">{data.description}</p>
          </div>

          {/* TAB MENU: Switch between Striver, Blind 75, etc. */}
          {data.sheets.length > 1 && (
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                {data.sheets.map((sheet: any) => (
                    <button 
                        key={sheet.id}
                        onClick={() => setActiveSheetId(sheet.id)}
                        className={`px-5 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-colors border ${
                            activeSheetId === sheet.id 
                            ? 'bg-[#ff4a1c]/10 text-[#ff4a1c] border-[#ff4a1c]/50' 
                            : 'bg-[#1a1a1a] text-gray-400 border-[#2a2a2a] hover:bg-[#252525]'
                        }`}
                    >
                        {sheet.name}
                    </button>
                ))}
            </div>
          )}

          {loadingSheet || loadingProgress ? (
              <div className="text-center py-20 text-gray-500 animate-pulse">Loading sheet data...</div>
          ) : !sheetData ? (
              <div className="text-center py-20 text-red-500 bg-red-500/10 rounded-lg border border-red-500/20">
                  Data file for this sheet is missing. Make sure <b>public/data/sheets/{activeSheetId}.json</b> exists!
              </div>
          ) : (
            <div className="space-y-4">
              {sheetData.steps.map((step: any) => {
                const allTaskIds = step.lectures.flatMap((lecture: any) => lecture.tasks.map((task: any) => task.id));
                const completedCount = allTaskIds.filter((id: string) => safeCompletedTasks.includes(id)).length;
                const progress = allTaskIds.length === 0 ? 0 : (completedCount / allTaskIds.length) * 100;

                return (
                  <div key={step.id} className="overflow-hidden rounded-lg border border-[#2a2a2a] bg-[#1a1a1a]">
                    <div className="flex items-center justify-between border-b border-[#2a2a2a] px-6 py-4">
                      <h2 className="text-lg font-bold text-white">{step.title}</h2>
                      <div className="flex items-center gap-4">
                        <div className="hidden h-1.5 w-32 overflow-hidden rounded-full bg-gray-700 md:block">
                          <div className="h-full bg-[#ff4a1c] transition-all" style={{ width: `${progress}%` }} />
                        </div>
                        <span className="text-sm text-gray-400">{completedCount} / {allTaskIds.length}</span>
                      </div>
                    </div>

                    {step.lectures.map((lecture: any) => {
                      const isExpanded = expandedLectures[lecture.id] ?? false;

                      return (
                        <div key={lecture.id} className="border-b border-[#2a2a2a] last:border-0">
                          <div onClick={() => toggleLecture(lecture.id)} className="flex cursor-pointer items-center justify-between px-6 py-3 transition-colors hover:bg-[#252525]">
                            <span className="text-sm font-semibold text-gray-300">{lecture.title}</span>
                            <span className="text-xs text-gray-500">{isExpanded ? "▼" : "▶"}</span>
                          </div>

                          {isExpanded && (
                            <div className="bg-[#141414]">
                              <div className="grid grid-cols-[40px_1fr_80px_80px_80px] gap-4 border-y border-[#2a2a2a] px-6 py-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                                <div className="text-center">Status</div>
                                <div>Problem</div>
                                <div className="text-center">YouTube</div>
                                <div className="text-center">Practice</div>
                                <div className="text-center">Difficulty</div>
                              </div>

                              {lecture.tasks.map((task: any) => {
                                const isChecked = safeCompletedTasks.includes(task.id);
                                return (
                                  <div key={task.id} className="grid grid-cols-[40px_1fr_80px_80px_80px] items-center gap-4 px-6 py-3 transition-colors hover:bg-[#1a1a1a]">
                                    <div className="flex justify-center">
                                      <button onClick={() => handleToggleTask(task.id)} className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${isChecked ? "border-[#ff4a1c] bg-[#ff4a1c]" : "border-gray-600 hover:border-gray-400"}`}>
                                        {isChecked && <span className="text-xs text-white">✓</span>}
                                      </button>
                                    </div>
                                    <div className={`text-sm font-medium ${isChecked ? "text-gray-500 line-through" : "text-gray-200"}`}>
                                      {task.title}
                                    </div>
                                    <div className="flex justify-center">
                                      {task.ytLink ? <a href={task.ytLink} target="_blank" rel="noopener noreferrer" className="text-lg text-red-500 transition-colors hover:text-red-400">▶</a> : <span className="text-gray-600">-</span>}
                                    </div>
                                    <div className="flex justify-center">
                                      <a href={task.practiceLink} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-[#ff4a1c] transition-colors hover:text-orange-400">Solve</a>
                                    </div>
                                    <div className="flex justify-center">
                                      <span className={`rounded-md px-3 py-1 text-[10px] font-bold text-white ${task.difficulty === "Easy" || task.difficulty === "Basic" ? "bg-green-600" : task.difficulty === "Medium" ? "bg-yellow-500" : "bg-red-600"}`}>
                                        {task.difficulty}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default LearningSheet;
