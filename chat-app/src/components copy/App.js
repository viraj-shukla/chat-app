import React from 'react';
import '../css/App.css';
import FriendSearch from './FriendSearch'
import Conversation from './Conversation'

/*
  TODO:
  - Formatting sent/received texts differently
  - Move sending text below text history
*/

class App extends React.Component {
  state = {
    user: "Pamela Beasley",
    conversations: [],
    currentFriend: 'Jim Halpert'
  }

  doSelectFriend = (name) => {
    this.setState({
      currentFriend: name
    })
  }

  componentDidMount() {
    fetch("./conversations.json")
      .then(response => response.json())
      .then(result => {
        this.setState({
          conversations: result
        })
      })
  }

  render() {

    let currentConversation = this.state.conversations.find(item => item.name === this.state.currentFriend)

    return (
      <div>
        <h1>Welcome {this.state.user}!</h1>
        <FriendSearch 
          conversations={this.state.conversations}
          doSelectFriend={this.doSelectFriend}
        />
        <Conversation
          conv={currentConversation}
        />
      </div>
    )
  }
}

export default App;
