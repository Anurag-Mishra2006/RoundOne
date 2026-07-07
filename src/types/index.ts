export interface User{
    id : string,
    name : string, 
    email : string,
}

export interface Question{
    id : number,
    question: string,
    topic : string
};

export interface HRTechnicalRound{
    round : string,
    company: string,
    role : string,
    candidateName : string,
    questions : Question[]
};
export interface Example{
    input: string,
    output: string,
    explanation: string,
}
export interface Problem{
    id: number,
    title: string,
    description: string,
    examples: Example[],
    constraints: string[],
    topic: string,
    difficulty: string
}

export interface DsaRound{
    round: string,
    company: string,
    level: string,
    language: string,
    problem : Problem
}

export interface EvaluateResult{
    round : string,
    score: number,
    maxScore: number,
    feedback: string,
    strongPoints: string[],
    improvements:string[],
    suggestion: string,
    question? : string,
    answer? : string
}

export interface InterviewStartResponse {
  hr: HRTechnicalRound
  technical: HRTechnicalRound
  dsa: DsaRound
}

export interface EvaluateResponse {
  evaluateResult: EvaluateResult
}
