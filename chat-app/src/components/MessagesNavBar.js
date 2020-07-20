import React from 'react';
import { Link } from 'react-router-dom';
import '../css/App.css';

class MessagesNavBar extends React.Component {    
    render() {
        return (
            <ul class="nav">
                <a href="#" class="profile dropdown">
                    <li>
                        Profile
                        <div class="profile-content">
                            <Link to={'/'}>Settings</Link>
                            <Link to={'/'} onClick={this.props.handleLogout}>Log Out</Link>
                        </div>
                    </li>
                </a>
                
            </ul>
        )
    }
}

export default MessagesNavBar;

//<li><Link to={'/login'}>Log In</Link></li>
//<li><Link to={'/signup'}>Sign Up</Link></li>