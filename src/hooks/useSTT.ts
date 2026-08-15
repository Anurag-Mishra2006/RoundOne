import { useRef, useState } from "react"
import { transcribeAudio } from "@/services/api.js"

export const useSTT = () => {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const mediaRecoderRef = useRef<MediaRecorder | null>(null);
    const chunkRef = useRef<Blob[]>([])

    const startRecording = async () => {
        try {
            // ask for mic permission 
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // create MediaRecorder -> this contains the blobs of audio
            const mediaRecoder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            mediaRecoderRef.current = mediaRecoder;
            chunkRef.current = [];

            // when audio data avaialbe push it to chunk
            mediaRecoder.ondataavailable = ((e) => {
                if (e.data.size > 0) {
                    chunkRef.current.push(e.data);
                }
            });

            // START RECORDING IN 1 SECOND (1000ms) CHUNKS (Prevents memory crash for long audio)
            mediaRecoder.start(1000); 
            setIsRecording(true);

        } catch (error) {
            console.error("Microphone access denied or error", error);
            alert("Please allow microphone access to use this feature.");
        }
    };
    const stopRecording = (): Promise<string> => {
        return new Promise((resolve, reject) => {
            if (!mediaRecoderRef.current) {
                reject("No media recorder initialized");
                return;
            }

            //   MUST WRAP THE LOGIC IN .onstop!
            mediaRecoderRef.current.onstop = async () => {
                setIsRecording(false);
                setIsProcessing(true);

                const audioBlob = new Blob(chunkRef.current, { type: 'audio/webm' });
                mediaRecoderRef.current?.stream.getTracks().forEach(track => track.stop());

                try {
                    const response = await transcribeAudio(audioBlob);

                    if (response.status !== 200) {
                        reject("Transcription Failed")
                    }
                    // Axios puts the JSON response inside `response.data`.
                    // Your backend returns { transcript: "..." }, so we need response.data.transcript
                    resolve(response.data.transcript);

                } catch (error) {
                    console.error(error)
                    reject(error)
                } finally {
                    setIsProcessing(false); // 3. Fixed typo: was isProcessing(false)
                }
            };

            // Trigger the stop, which triggers the .onstop event above!
            mediaRecoderRef.current.stop();
        });
    }
    return {isProcessing, isRecording, startRecording, stopRecording}

}
