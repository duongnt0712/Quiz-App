import { NavLink } from 'react-router-dom'; 

import './Menu.css'

export default function Menu() {
    return <aside>
        <h3>WPR</h3>
        <header>
            <h2>HTML Quiz</h2>
        </header>
        
        <ul>
            <li><NavLink exact to="/questions"><i className="far fa-question-circle"></i> All questions</NavLink></li>
            <li><NavLink to="/questions/add"><i className="far fa-plus"></i> New question</NavLink></li>
        </ul>
    </aside>;
}