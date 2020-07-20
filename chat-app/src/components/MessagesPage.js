import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/App.css';
import { authorize, logout } from '../util/auth';
import Conversation from './Conversation'
import MessagesNavBar from './MessagesNavBar'

class MessagesPage extends React.Component {

    state = {
        uid: '',
        firstName: '',
        lastName: '',
        friendSearch: '',
        currentFriend: '',
        currentFriendUid: null,
        texts: null,
        error: ''
    }

    handleFriendSearchChange = (event) => {
        this.setState({
            friendSearch: event.target.value
        })
    }

    handleFriendSearchSubmit = (event) => {
        fetch('https://us-central1-chat-app-5527e.cloudfunctions.net/api/friendSearch', {
            method: 'POST',
            headers: {
                "Content-type": "text/plain",
            },
            body: JSON.stringify({
                friend: this.state.friendSearch
            })
        })
            .then(res => res.text())
            .then(data => {
                let dataJSON = JSON.parse(data)
                console.log(dataJSON)
                if (dataJSON.error) {
                    this.setState({
                        error: dataJSON.error,
                    })
                }
                else {
                    this.setState({
                        currentFriendUid: dataJSON.uid,
                        currentFriend: this.state.friendSearch,
                        friendSearch: ''
                    })
                }
            })
        
        event.preventDefault()
    }




    handleLogout = () => {
        logout()
        fetch('https://us-central1-chat-app-5527e.cloudfunctions.net/api/logout', {
            method: 'POST'
        })
    }

    componentDidMount() {

        let authResult = authorize()

        if (authResult.error) {
            this.props.history.push('/login')
        }
        else {
            fetch('https://us-central1-chat-app-5527e.cloudfunctions.net/api/messages', {
                method: 'POST',
                headers: {
                    "Content-type": "text/plain",
                },
                body: JSON.stringify({
                    uid: authResult.uid
                })
            })
                .then(res => res.text())
                .then(data => {
                    console.log(data)
                    let dataJSON = JSON.parse(data)
                    if (!dataJSON.error) {
                        this.setState({
                            firstName: dataJSON.firstName,
                            lastName: dataJSON.lastName,
                            email: dataJSON.email,
                            uid: authResult.uid
                        })
                    }
                })
        }
    }

    render() {
        return (
            <div>
                    
                <div class="conversation-header">
                    <MessagesNavBar handleLogout={this.handleLogout} />
                    <h2>Hello {this.state.firstName} {this.state.lastName}!</h2>

                    <span id="logout">
                        <Link to={'/'} onClick={this.handleLogout}>
                            Logout
                        </Link>
                    </span>
                    <br/>

                    Search Friend: 
                    <form onSubmit={this.handleFriendSearchSubmit}>
                        <input
                            type="text"
                            id="friendSearch"
                            name="friendSearch"
                            value={this.state.friendSearch}
                            onChange={this.handleFriendSearchChange}
                        />

                        <button type="submit">
                            Search
                        </button>
                    </form>

                    {this.state.currentFriend === '' ?
                        <h3>You have not selected a friend yet!</h3> :
                        <h3>{this.state.currentFriend}</h3>
                    }
                </div>
                
                {this.state.currentFriend === '' ?
                    <></> :
                    <Conversation uid={this.state.uid}
                                  friendUid={this.state.currentFriendUid} />
                }
            </div>
        )
    }
}

export default MessagesPage;