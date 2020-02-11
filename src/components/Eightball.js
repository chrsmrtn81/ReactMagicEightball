import React, { Component } from 'react';
import RecentPosts from './RecentPosts';
import eightballImage from '../img/eightball.svg';
import axios from 'axios';

class Eightball extends Component {

    constructor(props) {
        super(props)
        this.state = {
            buttonTextArray: {
                text1: 'Shake the ball',
                text2: 'Enter a question',
                text3: 'Get your answer',
                text4: 'Ask another question',
            },
            answerList: [],
            RecentPostsList: [],
            toggleBallShake: false,
            postPrediction: false,
            randomAnswer: '',
            question: '',
            previousQuestion: '',
            ballState: 0,
            error: false
        }
        
        this.handleChange = this.handleChange.bind(this);
    
    }
    
    async componentDidMount() {
        axios.get(window.globalVars.apiURL + 'answers')
        .then(response => {
            this.setState({answerList: response.data});
            this.setRandomAnswer();
        })
        .catch(error => {
            console.log(error);
        });

        axios.get(window.globalVars.apiURL + 'predictions?_sort=created_at:desc')
        .then(response => {
            this.setState({RecentPostsList: response.data});
        })
        .catch(error => {
            console.log(error);
        });
    }

    handleChange = (e) => {
        this.setState({question: e.target.value});
    }

    setRandomAnswer = () => {
        let answers = this.state.answerList.map((item) => (item.answer));
        let setRandomAnswer = answers[Math.floor(Math.random()*answers.length)];
        this.setState({randomAnswer: setRandomAnswer})
    }

    setBallState = () => {
        var i = this.state.ballState;
        if (i < 2){
            i++;
        } else { 
            i = 0; 
        }
        this.setState({ballState: i});
    }

    ballState = (ballState) => {       

        if(ballState === 0){

            if(this.state.question){
                this.setState({toggleBallShake : !this.state.toggleBallShake});
                this.setState({error : !this.state.error});
                this.setRandomAnswer();
                this.setBallState();
            } else {
                this.setState({error : true});
            }

        } else if (ballState === 1){

            let prediction = [this.state.randomAnswer, this.state.question];
            this.setState({toggleBallShake : !this.state.toggleBallShake});
            this.setState({error: false});

            if(prediction[1] === this.state.previousQuestion){
                setTimeout(() => {
                    this.setState({randomAnswer: 'You\'ve just asked that, ask a different question'});
                    this.setState({postPrediction : !this.state.postPrediction});
                }, 100);
            } else {
                setTimeout(() => {
  
                    axios.post(window.globalVars.apiURL + 'predictions', {
                        question: prediction[1],
                        answer: prediction[0]
                        })
                        .then(response => {
                        })
                        .catch(error => {
                            console.log(error);
                        });

                    // console.log(prediction[0]);
                    // console.log(prediction[1]);
                    this.setState({postPrediction : !this.state.postPrediction});
                    
                }, 100);
            }
    
            this.setState({previousQuestion: prediction[1]});
            this.setBallState();
        
        } else if (ballState === 2){

            this.setState({postPrediction : !this.state.postPrediction});
            this.setState({question: ''});
            this.setBallState();
        }

    };
   

    render() {
        
        return (

            <div>

                {/* Input label */}
                <div className="question__label">What's your question?</div>

                <form>

                    {/* Input */}
                    <input type="text" className="question__input my-1" value={this.state.question} onChange={this.handleChange} disabled={(this.state.ballState > 0) ? true : false}></input>
                    
                    <br></br>                    

                    {/* Button */}
                    <div>
                        {(() => {
                            if (this.state.ballState === 0) {
                                return (
                                    <button 
                                        className={`btn mb-1 ${(this.state.error) ? 'error' : 'success'}`}
                                        type="button"
                                        onClick={(this.state.question) ? this.ballState.bind(this, this.state.ballState): this.ballState.bind(this, this.state.ballState)}
                                    >
                                       
                                    {(this.state.question) ? this.state.buttonTextArray.text1 : this.state.buttonTextArray.text2}

                                    </button>
                                )
                            } else if (this.state.ballState === 1) {
                                return (
                                    <button 
                                        className={`btn mb-1 success`}
                                        type="button"
                                        onClick={this.ballState.bind(this, this.state.ballState)}
                                    >
                                       
                                    {this.state.buttonTextArray.text3}

                                    </button>
                                )
                            } else if (this.state.ballState === 2) {
                                return (
                                    <button 
                                        className={`btn mb-1 success`}
                                        type="button"
                                        onClick={(this.state.question) ? this.ballState.bind(this, this.state.ballState): this.ballState.bind(this, this.state.ballState)}
                                    >
                                       
                                    {this.state.buttonTextArray.text4}

                                    </button>
                                )
                            }
                        })()}
                    </div>

                </form>             

                {/* Answer */}
                <div className={`answer__container ${(this.state.postPrediction) ? 'answer--show' : ''}`}>
                    <h2 className="answer__text">{this.state.randomAnswer}</h2>
                </div>

                {/* Eightball */}
                <div className="eightball__container">
                    <img  className={`eightball__image ${(this.state.toggleBallShake) ? 'eightball--shake' : ''} ${(this.state.postPrediction) ? 'eightball--hide' : ''}`}  src={eightballImage} alt="Magic 8 Ball" >
                    </img>
                </div>

                {/* Recent questions and predictions - not started*/}
                <RecentPosts RecentPostsList={this.state.RecentPostsList} />

            </div>
        )
    }
}

export default Eightball
