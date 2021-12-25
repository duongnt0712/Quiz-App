import React from 'react';

import Container from '../../components/container/Container';
import './HomePage.css';

class HomePage extends React.Component {
    constructor() {
        super();

        this.state = {
            questions: []
        };
    }

    handleDelete = async (id) => {
        if(window.confirm("Are you sure that you want to delete this question?")) {
            await fetch(`http://localhost:3001/questions/${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-type": "application/json"
                }
            });

            this.setState({ 
                questions: this.state.questions.filter(quest => quest._id !== id) 
            });        
        }      
    }
    
    async componentDidMount() {
        const response = await fetch('http://localhost:3001/questions', {
            method: 'GET'
        });
        const questions = await response.json();

        this.setState({ questions });
    };
    
    render() {
        return <main>
        <div className="container">
            <h1>All questions</h1>
            
            <Container questions={this.state.questions} handleDelete={this.handleDelete} />  
                     
        </div>
    </main>
    };
}
export default HomePage;