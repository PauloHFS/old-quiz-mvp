export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      question: {
        Row: {
          alternatives: string[]
          correctID: number
          created_at: string
          id: string
          quiz_id: string
          title: string
        }
        Insert: {
          alternatives: string[]
          correctID: number
          created_at?: string
          id?: string
          quiz_id: string
          title?: string
        }
        Update: {
          alternatives?: string[]
          correctID?: number
          created_at?: string
          id?: string
          quiz_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quiz"
            referencedColumns: ["id"]
          }
        ]
      }
      quiz: {
        Row: {
          created_at: string
          id: string
          name: string
          status: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string
          status?: boolean
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          status?: boolean
          user_id?: string
        }
        Relationships: []
      }
      quiz_user_info: {
        Row: {
          age: number
          created_at: string
          gender: string
          geolocation: string
          id: string
          quiz_id: string
        }
        Insert: {
          age: number
          created_at?: string
          gender?: string
          geolocation?: string
          id?: string
          quiz_id: string
        }
        Update: {
          age?: number
          created_at?: string
          gender?: string
          geolocation?: string
          id?: string
          quiz_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_user_info_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quiz"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
