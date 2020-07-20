import React from 'react';
import { Link } from 'react-router-dom';
import '../css/App.css';
import {login}  from '../util/auth'

class SignupPage extends React.Component {
    state = {
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    }

    errors = {
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit = (event) => {
        //event.preventDevault()

        console.log(JSON.stringify(this.state))

        fetch('https://us-central1-chat-app-5527e.cloudfunctions.net/api/signup', {
            method: 'POST',
            headers: {
                "Content-type": "text/plain",
            },
            body: JSON.stringify({
                username: this.state.username,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                email: this.state.email,
                password: this.state.password,
                confirmPassword: this.state.confirmPassword
            })
        })
            .then(res =>  res.text())
            .then(data => {
                let dataJSON = JSON.parse(data)
                console.log(`token ${dataJSON.token}`)
                
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
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="firstName">First Name</label><br/>
                    <input 
                        type="text" 
                        id="firstName"
                        name="firstName"
                        value={this.state.firstName}
                        onChange={this.handleChange}
                    /><br/>
                    <label htmlFor="firstNameError">{this.errors.firstName}</label><br/><br/>

                    <label htmlFor="lastName">Last Name</label><br/>
                    <input 
                        type="text" 
                        id="lastName"
                        name="lastName"
                        value={this.state.lastName}
                        onChange={this.handleChange}
                    /><br/>
                    <label htmlFor="lastNameError">{this.errors.lastName}</label><br/><br/>

                    <label htmlFor="username">Username</label><br/>
                    <input 
                        type="text" 
                        id="username"
                        name="username"
                        value={this.state.username}
                        onChange={this.handleChange}
                    /><br/>
                    <label htmlFor="usernameError">{this.errors.username}</label><br/><br/>

                    <label htmlFor="email">Email</label><br/>
                    <input 
                        type="text" 
                        id="email"
                        name="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                    /><br/>
                    <label htmlFor="emailError">{this.errors.email}</label><br/><br/>

                    <label htmlFor="password">Password</label><br/>
                    <input 
                        type="text" 
                        id="password"
                        name="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                    /><br/>
                    <label htmlFor="passwordError">{this.errors.password}</label><br/><br/>

                    <label htmlFor="confirmPassword">Confirm Password</label><br/>
                    <input 
                        type="text" 
                        id="confirmPassword"
                        name="confirmPassword"
                        value={this.state.confirmPassword}
                        onChange={this.handleChange}
                    /><br/>
                    <label htmlFor="confirmPasswordError">{this.errors.confirmPassword}</label><br/><br/>

                    <button type="submit">
                        Submit
                    </button>
                </form>
            </div>
        )
    }
}

export default SignupPage;