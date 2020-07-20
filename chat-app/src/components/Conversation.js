import React, { useState } from 'react';
import '../css/App.css';

/*
    TODO:
    - Get texts right-justified
    - Start rendering texts from bottom of page to top
    - No overlap between text sending and texts - separate containers
    - No overlapping texts
*/

class Conversation extends React.Component {
    state = {
        textcontent: '',
        texts: []
    }

    messagesRef = React.createRef()

    scrollToBottomOfMessages = () => {
        this.messagesRef.current.scrollTop = this.messagesRef.current.scrollHeight
    }

    handleTextChange = (event) => {
        this.setState({
            textcontent: event.target.value
        })
    }

    handleSend = (event) => {
        event.preventDefault()

        if (this.state.textcontent == '') {
            return
        }

        let text = {
            sender: this.props.uid,
            content: this.state.textcontent
        }

        fetch('https://us-central1-chat-app-5527e.cloudfunctions.net/api/updatemessages', {
            method: 'POST',
            headers: {
                "Content-type": "text/plain",
            },
            body: JSON.stringify({
                text,
                uid: this.props.uid,
                friendUid: this.props.friendUid
            })
        })
            .then(res => res.text())
            .then(dataText => {
                let data = JSON.parse(dataText)
                console.log(`updated messages: ${dataText}`)
                if (data.texts) {
                    this.setState({
                        texts: data.texts.reverse(),
                        textcontent: ''
                    })
                }
            })
    }

    componentDidUpdate () {
        this.scrollToBottomOfMessages()
    }

    componentDidMount() {
        fetch('https://us-central1-chat-app-5527e.cloudfunctions.net/api/retrievemessages', {
            method: 'POST',
            headers: {
                "Content-type": "text/plain",
            },
            body: JSON.stringify({
                uid: this.props.uid,
                friendUid: this.props.friendUid
            })
        })
            .then(res => res.text())
            .then(dataText => {
                let data = JSON.parse(dataText)
                console.log(`retrieved messages: ${dataText}`)
                this.setState({
                    texts: data.texts.reverse()
                })
            })
        
        this.scrollToBottomOfMessages()
    }

    render() {
        return (
            <div class="conversation">
                <form class="sendtext" onSubmit={this.handleSend}>
                    <input
                        type="text"
                        name="textcontent"
                        id="sendtext-content"
                        value={this.state.newtext}
                        onChange={this.handleTextChange}
                    />

                    <button id="sendtext-button" type="submit">
                        Send
                    </button>
                </form>

                    <div class="texts-container" ref={this.messagesRef}>
                        {this.state.texts.map(text => (
                            <div class={text.sender == this.props.uid ?
                                        'text-sent' :
                                        'text-received'}
                            >
                                {text.content}
                            </div>
                        ))}

                        <div id="bottomoftexts"></div>
                    </div>

            </div>
        )
    }
}

export default Conversation;