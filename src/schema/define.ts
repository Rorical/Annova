export interface PersonaInfo {
  id?: string
  name: string
  description: string
}
export enum MessageFrom {
  Character = 0,
  User
}
export interface ChatMessage {
  from: MessageFrom
  content: string
}

export interface GenerationConfig {
  max_tokens: number
  temperature: number
  top_p: number
  top_k: number
  num_return_sequences: number
}

export interface GenerationRequest {
  persona: string
  history: ChatMessage[]
  cfg: GenerationConfig
}

export enum AdminMode {
  Prompt,
  SFT,
}

export interface PromptReview {
  id: number
  name: string
  description: string
}

export interface SFTReview {
  id: number
  persona: PersonaInfo
  from: string
  history: ChatMessage[]
}