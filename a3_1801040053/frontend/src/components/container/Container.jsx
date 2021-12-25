import React from 'react';
import { Link } from 'react-router-dom'; 

import './Container.css';

class Container extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchField: ''
        }
    };
    
    search = (event) => {
        this.setState({
            searchField: event.target.value
        });
    };
    
    render() {
        //filter
        const filteredQuestions = [];
        for (const question of this.props.questions) {
            if (question.text.toLowerCase().includes(this.state.searchField)) {
                filteredQuestions.push(question);
            }
        };   

        return <>
            <div id="search">
                <input type="search" placeholder="Search..." onChange={ this.search }/>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Question</th>
                        <th>Answer</th>
                        <th width="210">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredQuestions.map((question, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{question.text}</td>
                            <td>{question.answers[question.correctAnswer]}</td>
                            <td>
                                <Link to={`/questions/${question._id}`} className="btn btn-blue"><i className="far fa-edit"></i> Edit</Link>
                                <button className="btn btn-orange" onClick={() => this.props.handleDelete(question._id)}><i className="far fa-trash-alt"></i> Delete</button>
                            </td>
                        </tr>
                    ))} 
                </tbody>    
            </table>
        </>
    }
}
export default Container;