import jwt_decode from 'jwt-decode'

// Save token to local storage
export var login = (token) => {
    if (!token) {
        return { error: 'token is undefined' }
    }
    localStorage.setItem('AuthToken', `Bearer ${token}`)
    return { uid: jwt_decode(token).uid }
}

// Return uid from token
export var authorize = () => {
    let storage = localStorage.getItem('AuthToken')
    if (!storage) {
        return { error: 'token is not present' }
    }
    let token = storage.split(' ')[1]
    let decodedToken = jwt_decode(token)
    return { uid: decodedToken.uid }
}

// Delete token from local storage
export var logout = () => {
    localStorage.removeItem('AuthToken')
}