

import * as React from 'react';
import styles from './QuizTest.module.scss';
import { IQuizTestProps } from './IQuizTestProps';
import { IQuizTestQuestions, IQuizTestState } from './IQuizTestState';
import { PrimaryButton } from '@fluentui/react/lib/Button';
//import { IHttpClientOptions, HttpClientResponse, HttpClient } from '@microsoft/sp-http';
import * as moment from 'moment';
import { SPFx, spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";


export default class QuizTest extends React.Component<IQuizTestProps, IQuizTestState> {



  constructor(props: IQuizTestProps, state: IQuizTestState) {
    super(props);

    this._startQuiz = this._startQuiz.bind(this);
    this._startNewQuiz = this._startNewQuiz.bind(this);
    this._nextQuestion = this._nextQuestion.bind(this);
    this._selectedAnswer = this._selectedAnswer.bind(this);

    this.state = {
      quiz: [],
      start: false,
      currentQuestion: 1,
      selectedAnswer: "",
      answered: false,
      startTime: '',
      endTime: '',
      timePassed: '',
      selectedAnswerCorrect: '',
      NumberOfCorrectAnswers: 0,
      quizCompleted: false
    }
  }

  public componentDidUpdate(prevProps: Readonly<IQuizTestProps>, prevState: Readonly<IQuizTestState>, snapshot?: any): void {
   // if (prevState.start !== this.state.start) {
   //   if (this.state.start) {
   //     this.startData();
   //   }
   // }
    if (prevState.quizCompleted !== this.state.quizCompleted) {
      if (this.state.quizCompleted) {
        this._insertQuizResIntoSPList();
      }
    }
  }

  private async _insertQuizResIntoSPList() {
    const sp = spfi().using(SPFx(this.props.context));

    await sp.web.lists.getByTitle("QuizTest").items.add({
      Title: this.props.userDisplayName,
      CorrectAnswers: this.state.NumberOfCorrectAnswers.toString(),
      TimeElapsed: this.state.timePassed,
      StartTime: this.state.startTime,
      EndTime: this.state.endTime,
      QuestionAnswered: this.state.selectedAnswer
    });
  }




  _nextQuestion() {
    this.setState({ currentQuestion: this.state.currentQuestion + 1, answered: false, selectedAnswerCorrect: "" });

    const collection: any = document.getElementsByClassName("_Answers");
    for (let index = 0; index < collection.length; index++) {
      collection[index].style.background = '#106EBE';
      collection[index].removeAttribute('disabled');
    }

    if (this.state.currentQuestion === this.state.quiz.length) {
      let endDt = new Date().toISOString();
      this.setState({ endTime: endDt });

      let timePassed = moment(endDt, 'YYYY-MM-DD[T]HH:mm:ss. SSS[Z]').diff(moment(this.state.startTime, 'YYYY-MM-DD[T]HH:mm:ss. SSS[Z]'), 'seconds');

      this.setState({ timePassed: timePassed.toString(), selectedAnswerCorrect: "", quizCompleted: true });
    }


  }

  _selectedAnswer(event: any, QuestionNo: string, Answer: string) {





    event.target.style.backgroundColor = "#04AA6D";
    this.setState({ selectedAnswer: this.state.selectedAnswer + " " + QuestionNo + " - " + Answer, answered: true });

    const collection = document.getElementsByClassName("_Answers");
    for (let index = 0; index < collection.length; index++) {
      collection[index].setAttribute('disabled', 'disabled');
    }

    if (this.state.quiz[Number(QuestionNo) - 1].answer === Answer) {
      this.setState({ selectedAnswerCorrect: "Correct, it is: " + Answer, NumberOfCorrectAnswers: this.state.NumberOfCorrectAnswers + 1 })

    }
    else {
      this.setState({ selectedAnswerCorrect: "Incorrect, the correct answer is: " + this.state.quiz[Number(QuestionNo) - 1].answer })
    }
  }

  _startNewQuiz() {
    this.setState({quiz: [],
      start: false,
      currentQuestion: 1,
      selectedAnswer: "",
      answered: false,
      startTime: '',
      endTime: '',
      timePassed: '',
      selectedAnswerCorrect: '',
      NumberOfCorrectAnswers: 0,
      quizCompleted: false});

      this._startQuiz();
  }

  _startQuiz() {

    this.setState({ start: true });
    this.setState({
      quiz:
        [
          {
            questionNo: 1,
            question: 'Which of these is the name of an infectious viral disease?',
            options: ['Lumps', 'Humps', 'Mumps', 'Bumps'],
            answer: 'Mumps'
          },
          {
            questionNo: 2,
            question: 'Which Island is not part of Maltese Islands?',
            options: ['Komino', 'Gozo', 'Malta','Kremino'],
            answer: 'Kremino'
          },
          {
            questionNo: 3,
            question: 'What is the capital of Bosnia?',
            options: ['Skopje', 'Subotica', 'Tuzla', 'Sarajevo'],
            answer: 'Sarajevo'
          },
          {
            questionNo: 4,
            question: 'What is the capital of Manitoba?',
            options: ['Ottawa', 'Edmonton', 'Pembina', 'Winnipeg'],
            answer: 'Winnipeg'
          }
        ]
    })

    let startDt = new Date().toISOString();
    this.setState({ startTime: startDt });

  }



  /* private startData(): Promise<HttpClientResponse> {
    const url = "https://timeapi.io/api/Time/current/zone?timeZone=Europe/Amsterdam"
    const requestHeaders: Headers = new Headers();
    requestHeaders.append('Content-type', 'application/json');
    const httpClientOptions: IHttpClientOptions = {
      method: "GET",
      mode: "no-cors",
      headers: requestHeaders
    };
    return this.props.context.httpClient.get(
      url,
      HttpClient.configurations.v1,
      httpClientOptions)
      .then((response: HttpClientResponse): Promise<HttpClientResponse> => {
        console.log(response);
        return response.json();
      });
  }; */









  public render(): React.ReactElement<IQuizTestProps> {
    const {

      hasTeamsContext,

    } = this.props;

    return (
      <section className={`${styles.quizTest} ${hasTeamsContext ? styles.teams : ''}`}>
        <div><h3><b>Welcome {this.props.userDisplayName}</b></h3></div>
        {this.state.quizCompleted && <><div><h3><b>Correct Answers: {this.state.NumberOfCorrectAnswers} / {this.state.quiz.length}  - Time in Seconds:{this.state.timePassed}s</b></h3></div>
        <PrimaryButton onClick={this._startNewQuiz}>Start New Quiz</PrimaryButton></>
        }

        <div>
          {this.state.start && this.state.quiz.length && this.state.quiz.filter(obj => obj.questionNo === this.state.currentQuestion).map((Question: IQuizTestQuestions, index) => {
            return (
              <>
                <div><h3><b>{this.state.selectedAnswerCorrect}</b></h3></div>
                <br></br>
                <div><h3><b>{Question.question}</b></h3></div>
                <div className={styles.wrapper}>

                  {Question.options.length && Question.options.map((offeredAnswers, indAnswers) => {
                    return (
                      <div id={indAnswers.toString() + "Answer"} className={styles.column}>
                        <button className='_Answers' style={{ fontSize: "18px", background: "#106EBE", color: "white", cursor: "pointer" }}
                          id={indAnswers.toString() + "_Btn"}
                          onClick={(event) => this._selectedAnswer(event, Question.questionNo.toString(), offeredAnswers)}>{offeredAnswers}</button>
                      </div>
                    );
                  })}


                  <br></br>
                  {this.state.currentQuestion <= this.state.quiz.length && this.state.answered &&
                    <PrimaryButton className={styles.nextbtn} onClick={this._nextQuestion}>{Question.questionNo === this.state.quiz.length ? "Finish " : "Next "}{Question.questionNo} / {this.state.quiz.length}</PrimaryButton>
                  }
                </div></>
            );
          })}
          {!this.state.start &&
            <PrimaryButton onClick={this._startQuiz}>Start Quiz</PrimaryButton>
          }

        </div>
      </section>
    );
  }
}
