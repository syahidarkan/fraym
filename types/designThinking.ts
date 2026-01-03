// Design Thinking Data Types

export interface Interview {
    id: string
    title: string
    description: string
    questions: InterviewQuestion[]
    responses: InterviewResponse[]
    shareLink: string
    targetResponses: number
    createdAt: number
    updatedAt: number
}

export interface InterviewQuestion {
    id: string
    type: 'text' | 'multipleChoice' | 'rating' | 'yesNo'
    question: string
    options?: string[] // for multiple choice
    required: boolean
}

export interface InterviewResponse {
    id: string
    interviewId: string
    respondentName?: string
    respondentEmail?: string
    answers: Record<string, any> // questionId -> answer
    submittedAt: number
}

export interface Persona {
    id: string
    name: string
    age?: number
    occupation?: string
    avatar?: string
    demographics: string
    goals: string[]
    painPoints: string[]
    behaviors: string[]
    quote?: string
    createdAt: number
}

export interface EmpathyMap {
    id: string
    personaId?: string
    says: string[]
    thinks: string[]
    does: string[]
    feels: string[]
    createdAt: number
}

export interface ProblemStatement {
    id: string
    user: string // persona or user type
    need: string
    insight: string
    statement: string // auto-generated
    priority: number
    createdAt: number
}

export interface HMWQuestion {
    id: string
    question: string
    votes: number
    category?: string
    createdAt: number
}

export interface UserJourney {
    id: string
    personaId?: string
    stages: JourneyStage[]
    createdAt: number
}

export interface JourneyStage {
    id: string
    name: string
    actions: string[]
    thoughts: string[]
    emotions: string[]
    painPoints: string[]
    opportunities: string[]
}

export interface BrainstormIdea {
    id: string
    content: string
    category?: string
    votes: number
    x: number
    y: number
    color: string
    createdAt: number
}

export interface BrainstormBoard {
    id: string
    name: string
    ideas: BrainstormIdea[]
    createdAt: number
}

export interface FeaturePriority {
    id: string
    name: string
    description: string
    impact: number // 1-10
    effort: number // 1-10
    quadrant: 'quick-win' | 'major-project' | 'fill-in' | 'thankless-task'
    createdAt: number
}

// Phase 4: Test
export interface UsabilityTest {
    id: string
    name: string
    description: string
    prototypeLink?: string // Figma prototype link
    tasks: TestTask[]
    targetParticipants: number
    status: 'draft' | 'active' | 'completed'
    shareLink: string
    createdAt: number
    updatedAt: number
}

export type TaskResponseType = 'scale' | 'text' | 'yes_no' | 'multiple_choice'

export interface TestTask {
    id: string
    title: string
    description: string
    successCriteria: string
    order: number
    responseType: TaskResponseType
    questionText?: string
    options?: string[] // For multiple choice
}

export interface TestResult {
    id: string
    testId: string
    participantName: string
    participantEmail: string
    completedAt: number
    taskResults: TaskResult[]
    overallFeedback: string
    npsScore?: number // 0-10
}

export interface TaskResult {
    taskId: string
    completed: boolean
    timeSpent: number // seconds
    difficulty?: number // Deprecated, use response for new tests
    response?: string | number
    feedback: string
    clickPath?: string[] // element IDs clicked
}

export interface DesignThinkingProject {
    id: string
    name: string
    description: string

    // Phase 1: Empathize
    interviews: Interview[]
    personas: Persona[]
    empathyMaps: EmpathyMap[]

    // Phase 2: Define
    problemStatements: ProblemStatement[]
    hmwQuestions: HMWQuestion[]
    userJourneys: UserJourney[]

    // Phase 3: Ideate
    brainstormBoards: BrainstormBoard[]
    featurePriorities: FeaturePriority[]

    // Phase 4: Test
    usabilityTests: UsabilityTest[]
    testResults: TestResult[]

    // Metadata
    currentPhase: 'empathize' | 'define' | 'ideate' | 'prototype' | 'test'
    createdAt: number
    updatedAt: number
}

// Helper function to generate share link
export function generateShareLink(interviewId: string): string {
    return `${window.location.origin}/interview/${interviewId}`
}

// Helper to calculate feature quadrant
export function calculateQuadrant(impact: number, effort: number): FeaturePriority['quadrant'] {
    if (impact >= 5 && effort < 5) return 'quick-win'
    if (impact >= 5 && effort >= 5) return 'major-project'
    if (impact < 5 && effort < 5) return 'fill-in'
    return 'thankless-task'
}
