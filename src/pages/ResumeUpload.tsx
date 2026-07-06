import { useState } from "react";
import { uploadResume } from "../services/api.js";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar.js";

function ResumeUpload() {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File must be under 5MB")
      return
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
        setError("Upload failed")
        return
      }
      navigate("/onboarding");

    } catch (error: any) {
      // This will grab every piece of info about the error and print it as a giant string.
      let debugMessage = "Something went wrong";
      
      if (error.response) {
         // The request was made and the server responded with a status code
         // that falls out of the range of 2xx
         debugMessage = `Server Error [${error.response.status}]: ${JSON.stringify(error.response.data)}`;
      } else if (error.request) {
         // The request was made but no response was received
         debugMessage = `Network Error (No Response): ${JSON.stringify(error.message)}`;
      } else {
         // Something happened in setting up the request that triggered an Error
         debugMessage = `Axios Error: ${error.message}`;
      }

      setError(debugMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar />
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
            className="w-full rounded-md bg-[var(--accent)] px-4 py-2 text-white disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload Resume"}
          </button>
        </div>
      </div>
    </div>
    </>
  );
}

export default ResumeUpload;
