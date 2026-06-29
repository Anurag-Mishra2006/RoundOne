import { useState, useRef } from 'react'

export default function useTTS() {
    const [isSpeaking, setIsSpeaking] = useState<boolean>(false)
    const [isPaused, setIsPaused] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const audioRef = useRef<HTMLAudioElement | null>(null)

    const speak = async (text : string) => {
        if (!text.trim()) return

        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current = null
        }

        setIsLoading(true)

        try {
            const response = await fetch(`${import.meta.env.VITE_TTS_BACKEND_UR}/speak`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: text,
                    voice: "en-IN-NeerjaNeural",
                    rate: "-30%",   
                    pitch: "-35Hz"  
                })
            })

            if (!response.ok) throw new Error("Server error")

            const audioBlob = await response.blob()
            const audioUrl = URL.createObjectURL(audioBlob)

            const audio = new Audio(audioUrl)
            audio.volume = 1.0;  
            audio.onplay = () => { setIsSpeaking(true); setIsPaused(false); }
            audio.onended = () => { setIsSpeaking(false); setIsPaused(false); }
            audio.onerror = () => { setIsSpeaking(false); setIsPaused(false); }

            audioRef.current = audio
            audio.play()

        } catch (error) {
            console.error("Failed to generate TTS:", error)
            setIsSpeaking(false)
        } finally {
            setIsLoading(false)
        }
    }

    const stop = () => {
        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
        }
        setIsSpeaking(false)
        setIsPaused(false)
    }

    const pause = () => {
        if (audioRef.current) {
            audioRef.current.pause()
            setIsPaused(true)
        }
    }

    const resume = () => {
        if (audioRef.current) {
            audioRef.current.play()
            setIsPaused(false)
        }
    }

    return {
        isSpeaking, isPaused, isLoading,
        speak, stop, pause, resume
    }
}
