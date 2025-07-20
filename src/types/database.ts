export interface Database {
    public: {
      Tables: {
        users: {
          Row: {
            id: string;
            email: string;
            name: string;
            avatar_url?: string;
            role: 'participant' | 'creator' | 'admin';
            created_at: string;
            updated_at: string;
          };
          Insert: {
            id: string;
            email: string;
            name: string;
            avatar_url?: string;
            role?: 'participant' | 'creator' | 'admin';
            created_at?: string;
            updated_at?: string;
          };
          Update: {
            id?: string;
            email?: string;
            name?: string;
            avatar_url?: string;
            role?: 'participant' | 'creator' | 'admin';
            updated_at?: string;
          };
        };
        user_preferences: {
          Row: {
            id: string;
            user_id: string;
            dark_mode: boolean;
            language: string;
            notifications: boolean;
            created_at: string;
            updated_at: string;
          };
          Insert: {
            id?: string;
            user_id: string;
            dark_mode?: boolean;
            language?: string;
            notifications?: boolean;
            created_at?: string;
            updated_at?: string;
          };
          Update: {
            dark_mode?: boolean;
            language?: string;
            notifications?: boolean;
            updated_at?: string;
          };
        };
        quizzes: {
          Row: {
            id: string;
            title: string;
            description?: string;
            creator_id: string;
            visibility: 'public' | 'private' | 'password';
            password?: string;
            status: 'draft' | 'published';
            timer_per_question: number;
            randomize_questions: boolean;
            created_at: string;
            updated_at: string;
          };
          Insert: {
            id?: string;
            title: string;
            description?: string;
            creator_id: string;
            visibility?: 'public' | 'private' | 'password';
            password?: string;
            status?: 'draft' | 'published';
            timer_per_question?: number;
            randomize_questions?: boolean;
            created_at?: string;
            updated_at?: string;
          };
          Update: {
            title?: string;
            description?: string;
            visibility?: 'public' | 'private' | 'password';
            password?: string;
            status?: 'draft' | 'published';
            timer_per_question?: number;
            randomize_questions?: boolean;
            updated_at?: string;
          };
        };
        quiz_questions: {
          Row: {
            id: string;
            quiz_id: string;
            question: string;
            type: 'multiple_choice' | 'true_false' | 'short_answer';
            options: string[];
            correct_answer: string;
            explanation?: string;
            points: number;
            order_index: number;
            created_at: string;
          };
          Insert: {
            id?: string;
            quiz_id: string;
            question: string;
            type?: 'multiple_choice' | 'true_false' | 'short_answer';
            options: string[];
            correct_answer: string;
            explanation?: string;
            points?: number;
            order_index: number;
            created_at?: string;
          };
          Update: {
            question?: string;
            type?: 'multiple_choice' | 'true_false' | 'short_answer';
            options?: string[];
            correct_answer?: string;
            explanation?: string;
            points?: number;
            order_index?: number;
          };
        };
        quiz_sessions: {
          Row: {
            id: string;
            quiz_id: string;
            host_id: string;
            status: 'waiting' | 'active' | 'completed';
            current_question: number;
            started_at?: string;
            ended_at?: string;
            created_at: string;
          };
          Insert: {
            id?: string;
            quiz_id: string;
            host_id: string;
            status?: 'waiting' | 'active' | 'completed';
            current_question?: number;
            started_at?: string;
            ended_at?: string;
            created_at?: string;
          };
          Update: {
            status?: 'waiting' | 'active' | 'completed';
            current_question?: number;
            started_at?: string;
            ended_at?: string;
          };
        };
        quiz_participants: {
          Row: {
            id: string;
            session_id: string;
            user_id: string;
            score: number;
            correct_answers: number;
            joined_at: string;
          };
          Insert: {
            id?: string;
            session_id: string;
            user_id: string;
            score?: number;
            correct_answers?: number;
            joined_at?: string;
          };
          Update: {
            score?: number;
            correct_answers?: number;
          };
        };
        quiz_answers: {
          Row: {
            id: string;
            session_id: string;
            user_id: string;
            question_id: string;
            answer: string;
            is_correct: boolean;
            response_time: number;
            points_earned: number;
            created_at: string;
          };
          Insert: {
            id?: string;
            session_id: string;
            user_id: string;
            question_id: string;
            answer: string;
            is_correct: boolean;
            response_time: number;
            points_earned: number;
            created_at?: string;
          };
          Update: {
            answer?: string;
            is_correct?: boolean;
            response_time?: number;
            points_earned?: number;
          };
        };
        leaderboards: {
          Row: {
            id: string;
            quiz_id: string;
            user_id: string;
            score: number;
            rank: number;
            completed_at: string;
          };
          Insert: {
            id?: string;
            quiz_id: string;
            user_id: string;
            score: number;
            rank: number;
            completed_at?: string;
          };
          Update: {
            score?: number;
            rank?: number;
          };
        };
      };
    };
  }
  
  export type User = Database['public']['Tables']['users']['Row'];
  export type Quiz = Database['public']['Tables']['quizzes']['Row'];
  export type QuizQuestion = Database['public']['Tables']['quiz_questions']['Row'];
  export type QuizSession = Database['public']['Tables']['quiz_sessions']['Row'];
  export type QuizParticipant = Database['public']['Tables']['quiz_participants']['Row'];
  export type QuizAnswer = Database['public']['Tables']['quiz_answers']['Row'];
  export type Leaderboard = Database['public']['Tables']['leaderboards']['Row'];