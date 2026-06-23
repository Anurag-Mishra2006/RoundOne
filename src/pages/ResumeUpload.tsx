import { useState } from "react";
import { uploadResume } from "../services/api.js";

function ResumeUpload() {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

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

      await uploadResume(uploadFile);

      // Optional: navigate to next page here
    } catch (error: any) {
      setError(
        error?.response?.data?.error || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-[var(--text)]">
            Upload Your Resume
          </h1>

          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Upload a PDF — we'll use it to generate personalized questions
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full"
          />

          {uploadFile && (
            <p className="text-sm text-[var(--text-muted)]">
              Selected: {uploadFile.name}
            </p>
          )}

          {error && (
            <p className="text-sm text-[var(--danger)]">
              {error}
            </p>
          )}

          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full rounded-md bg-[var(--primary)] px-4 py-2 text-white disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload Resume"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResumeUpload;