import React from 'react';
import './EditPage.css';

class EditPage extends React.Component {
    constructor() {
        super();

        this.state = {
            text:'',
            answers: [],
            correctAnswer: -1
        }
    }

    async componentDidMount() {
        const { id } = this.props.match.params;
        const response = await fetch(`http://localhost:3001/questions/${id}`, {
            method: 'GET'
        });
        const question = await response.json();

        this.setState({ 
            text: question.text,
            answers: question.answers,
            correctAnswer: question.correctAnswer
        });
    }

    handleAddAnswer = () => {
        this.setState({ 
            answers: this.state.answers.concat([""])
        });
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleChangeAnswer = (event, index) => {
        const answers = this.state.answers;
        answers[index] = event.target.value;

        this.setState({
            answers: answers
        });
    }

    handleChangeCorrectAnswer = (event) => {
        this.setState({
            correctAnswer: Number(event.target.value)
        });
    } 

    handleRemoveAnswer = (answer, index) => { 
        let correctAns = this.state.correctAnswer;
        if(correctAns === index) {
            correctAns = -1
        }
        this.setState({
            answers: this.state.answers.filter(ans => ans !== answer),
            correctAnswer: correctAns
        });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const { id } = this.props.match.params;
        const question = this.state;
        if (question.text === '') {
            alert("Text is empty!");
        } else if (question.answers.length < 2 ) {
            alert("You need to create at least 2 questions!");
        } else if (question.correctAnswer === -1) {
            alert("Correct answer is undefined!")
        } else {
            await fetch(`http://localhost:3001/questions/${id}`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(question)
            });
            alert("Updated successfully!");

            this.props.history.push("/");
        }
    } 

    render() {
        return <main>
            <div className="container">
                <h1>Edit question</h1>
                <form id="form-create" onSubmit={ this.handleSubmit }>
                    <div className="form-group">
                        <label htmlFor="text">Text</label>
                        <input type="text" name="text" value={this.state.text} onChange={ this.handleChange }/>
                    </div>
                    
                    <div className="form-group">
                        <label>Answers: </label>
                        {this.state.answers.map((answer, index) => (
                            <div className="answer" key={index}>
                                <input type="text" name="answers" value={answer} onChange={(event) => this.handleChangeAnswer(event, index)}/>
                                <div>
                                    <input 
                                        name="correctAnswer" 
                                        type="radio" 
                                        value={index} 
                                        id={"answer" + index} 
                                        checked={this.state.correctAnswer === index}
                                        onChange={this.handleChangeCorrectAnswer}
                                    /> 
                                    <label htmlFor={"answer" + index}>correct</label>
                                </div>

                                <button type="button" className="btn btn-orange" onClick={() => this.handleRemoveAnswer(answer, index)}>
                                    <i className="fas fa-times"></i> Remove
                                </button>
                            </div>
                        ))} 

                        <div className="text-right">
                            <button type="button" className="btn btn-blue" onClick={this.handleAddAnswer}><i className="fas fa-plus"></i> Add</button>
                        </div>
                    </div>

                    <div className="actions">
                        <button type="submit" className="btn btn-blue btn-large"><i className="fas fa-save"></i> Save</button>
                    </div>
                </form>
            </div>
        </main>
    }
}
export default EditPage;