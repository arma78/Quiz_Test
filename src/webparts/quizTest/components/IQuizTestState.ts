export interface IQuizTestState {
    quiz:IQuizTestQuestions[];
    start:boolean;
    currentQuestion:number;
    selectedAnswer:string;
    answered:boolean;
    startTime:string;
    endTime:string;
    timePassed:string;
    selectedAnswerCorrect:string;
    NumberOfCorrectAnswers:number;
    quizCompleted:boolean;
  }

  export interface IQuizTestQuestions {
    questionNo:number,
    question:string,
    options: string[],
    answer: string,
  }


