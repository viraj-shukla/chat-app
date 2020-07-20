import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'
import '../css/App.css';
import HomePage from './HomePage'
import MessagesPage from './MessagesPage'
import SignupPage from './SignupPage'
import LoginPage from './LoginPage'

class App extends React.Component {
  render() {
    return (
      <Router>
        <div id="content">
          <Switch>
            <Route path="/" exact component={HomePage} />
            <Route path="/messages" component={MessagesPage} />
            <Route path="/signup" component={SignupPage} />
            <Route path="/login" component={LoginPage} />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App;
