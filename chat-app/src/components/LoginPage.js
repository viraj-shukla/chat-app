import React from 'react';
import { Link } from 'react-router-dom';
import '../css/App.css';
import { login } from '../util/auth'

class LoginPage extends React.Component {
    state = {
        email: '',
        password: ''
    }

    errors = {
        email: '',
        password: ''
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit = (event) => {
        //event.preventDevault()

        console.log(JSON.stringify(this.state))

        fetch('https://us-central1-chat-app-5527e.cloudfunctions.net/api/login', {
            method: 'POST',
            headers: {
                "Content-type": "text/plain",
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        })
            .then(res =>  res.text())
            .then(data => {
                let dataJSON = JSON.parse(data)
                let loginResult = login(dataJSON.token)
                if (!loginResult.error) {
                    this.props.history.push('/messages')
                }
            })
            .catch(error => console.log(`Error: ${error}`))

        event.preventDefault()
    }

    handleError = (errors) => {
        this.errors = errors
    }

    render() {
        return (
            <div class="login-form">
                <h1>Chat App</h1>
                <h2>Log In</h2>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="email" class="form-input">Email</label><br/>
                    <input 
                        type="text" 
                        id="email"
                        name="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                    /><br/>
                    <label htmlFor="emailError">{this.errors.email}</label><br/><br/>

                    <label htmlFor="password" class="form-input">Password</label><br/>
                    <input 
                        type="text" 
                        id="password"
                        name="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                    /><br/>
                    <label htmlFor="passwordError">{this.errors.password}</label><br/><br/>

                    <button type="submit">
                        Log In
                    </button>
                </form>
            </div>
        )
    }
}

export default LoginPage;