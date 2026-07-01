import { useState, useRef } from 'react'
import {generateSpeech} from "@/services/api.js";

export default function useTTS() {
    const [isSpeaking, setIsSpeaking] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)
     
    const activeRequestId = useRef<number>(0)

    const speak = async (text: string) => {
        if (!text.trim()) return

        //  Give this specific speak request a unique ID
        const currentRequestId = ++activeRequestId.current

        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current = null
        }

        setIsLoading(true)

        try {
            const response = await generateSpeech({text, voice : "en-IN-NeerjaNeural", rate: "-30%", pitch: "-35Hz"})

            if (response.status !== 200) throw new Error("Server error")

            const audioBlob =  response.data;
            
            // CRITICAL CHECK: Did the user click "Next" or leave the page while we were waiting?
            // If the ID changed, STOP HERE and do not play the audio!
            if (activeRequestId.current !== currentRequestId) {
                return; 
            }

            const audioUrl = URL.createObjectURL(audioBlob)
            const audio = new Audio(audioUrl)
            audio.volume = 1.0;  
            audio.onplay = () => { setIsSpeaking(true) }
            audio.onended = () => { setIsSpeaking(false) }
            audio.onerror = () => { setIsSpeaking(false) }

            audioRef.current = audio
            audio.play()

        } catch (error) {
            console.error("Failed to generate TTS:", error)
            if (activeRequestId.current === currentRequestId) setIsSpeaking(false)
        } finally {
            if (activeRequestId.current === currentRequestId) setIsLoading(false)
        }
    }

    const stop = () => {
        // Increment the ID so any background downloads are instantly rejected
        activeRequestId.current++
        
        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
            audioRef.current = null
        }
        setIsSpeaking(false)
        setIsLoading(false)
    }

    return { isSpeaking, isLoading, speak, stop }
}
