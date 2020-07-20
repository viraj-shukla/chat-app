import React from 'react';
import { Link } from 'react-router-dom';
import '../css/App.css';
import HomeNavBar from './HomeNavBar'

class HomePage extends React.Component {
    render() {
        return (
            <div>
                <HomeNavBar type="home"></HomeNavBar>
                <h1 id="home">The home page!</h1>
            </div>
        )
    }
}

export default HomePage;