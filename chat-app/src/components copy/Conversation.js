import React from 'react';

class Conversation extends React.Component {
  state = {
    text: '',
    allTexts: []
  }

  doUpdateText = (e) => {
    this.setState({
      text: e.target.value
    })
    
    e.preventDefault()
  }

  doSubmitText = (e) => {
    let newAllTexts = this.state.allTexts
    newAllTexts.push(this.state.text)
    this.setState({
      allTexts: newAllTexts
    })
    
    e.preventDefault()
  }

  componentDidMount() {
    let response = fetch
  }

  render() {
    return (
      <div>
        <form onSubmit={this.doSubmitText}>
          <input 
            type="text"
            id="text"
            value = {this.state.text}
            onChange = {this.doUpdateText}
          />
          <button
            type="submit"
          >
            Send
          </button>
        </form>
        <h1>Text History:</h1>
        {this.props.conv ? 
            this.props.conv.texts.map((item, key) => (
            <div key={key}>{item.content}</div>
            )) 
            : ''}
      </div>
    )
  }
}

export default Conversation;