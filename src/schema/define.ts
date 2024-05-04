export interface PersonaInfo {
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
  persona: PersonaInfo
  history: ChatMessage[]
  cfg: GenerationConfig
}
