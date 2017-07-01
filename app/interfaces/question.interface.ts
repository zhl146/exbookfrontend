export interface AppQuestion{
  prompt: string,
  answers: AppAnswer[]
}

export interface AppAnswer{
  index: number,
  text: string
}

export interface AppQuestOptions{
  chapter_options: AppChapter[],
  number_of_questions_options: number[]
}

export interface AppChapter{
  chapter_index: number,
  chapter_name: string
}

export interface AppFeedback{
  is_correct: boolean,
  correct_answer: number,
  user_answer: number
}


