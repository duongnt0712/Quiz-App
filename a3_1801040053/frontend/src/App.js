import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import './App.css';
import Menu from './components/menu/Menu';
import HomePage from './pages/homepage/HomePage.jsx';
import AddPage from './pages/addpage/AddPage';
import EditPage from './pages/editpage/EditPage';

export default function App() {
    return <>
        <Menu />

        <Switch>
            <Redirect exact from="/" to="questions" />
            <Route exact path="/questions" component={ HomePage } />
            <Route path="/questions/add" component={ AddPage } />
            <Route path="/questions/:id" component={ EditPage } />
        </Switch>
    </>;
}

