import type { HRTechnicalRound, DsaRound, EvaluateResult } from "../types/index.js"
import { create } from "zustand"

export interface SessionState {
  company: string,
  role: string,
  level : string,
  hr: HRTechnicalRound | null
  technical: HRTechnicalRound | null
  dsa: DsaRound | null
  evaluations: EvaluateResult[]
  setSession: (data: {
    company: string
    role : string
    level : string
    hr: HRTechnicalRound
    technical: HRTechnicalRound
    dsa: DsaRound
  }) => void
  addEvaluation: (result: EvaluateResult) => void
  clearSession: () => void
}

const useSessionStore = create<SessionState>((set) => ({
  company: "",
  role: "",
  level: "",
  hr: null,
  technical: null,
  dsa: null,
  evaluations: [],

  setSession: (data) => set({
    company: data.company,
    role: data.role,
    level: data.level,
    hr: data.hr,
    technical: data.technical,
    dsa: data.dsa,
    evaluations: []
  }),

  addEvaluation: (result) => set((state) => ({
    evaluations: [...state.evaluations, result]
  })),

  clearSession: () => set({
    company: "",
    role: "",
    level: "",
    hr: null,
    technical: null,
    dsa: null,
    evaluations: []
  })
}))

export default useSessionStore
