import React from 'react';
import { Link } from 'react-router-dom';
import '../css/App.css';

class HomeNavBar extends React.Component {    
    render() {
        return (
            <ul class="nav">
                <Link to={'/login'}><li>Log In</li></Link>
                <Link to={'/signup'}><li>Sign Up</li></Link>
            </ul>
        )
    }
}

export default HomeNavBar;

//<li><Link to={'/login'}>Log In</Link></li>
//<li><Link to={'/signup'}>Sign Up</Link></li>