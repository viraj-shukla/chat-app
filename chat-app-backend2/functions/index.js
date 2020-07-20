const functions = require('firebase-functions');

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.js');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://chat-app-5527e.firebaseio.com"
});
let db = admin.firestore();

const firebase = require('firebase');
const firebaseConfig = require('./firebaseConfig.js')
firebase.initializeApp(firebaseConfig);

const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(bodyParser.text());


function queryMessagesDoc(id1, id2, idOrder) {
    if (idOrder < 0) {
        return db.collection('messages')
                    .where('users.id1', '==', id1)
                    .where('users.id2', '==', id2)
    }
    else {
        return db.collection('messages')
                    .where('users.id1', '==', id2)
                    .where('users.id2', '==', id1)
    }
}

function retrieveMessages(uid, friendUid) {
    var textsRetrieved = []

    queryMessagesDoc(uid, friendUid, uid.localeCompare(friendUid))
        .get()
        .then(querySnapshot => {
            
            if (!(querySnapshot.empty)) {
                let doc = querySnapshot.docs[0]
                
                return doc.data().texts
                //console.log(`retrieve texts retrieved 1: ${JSON.stringify(textsRetrieved)}`)
            }
        })

    //console.log(`retrieve texts retrieved 2: ${JSON.stringify(textsRetrieved)}`)
    return textsRetrieved
}

// Get messages when first loading conversation (or refreshing)
app.post('/retrievemessages', (req, res) => {
    let userIDs = JSON.parse(req.body)

    //console.log(`uid: ${userIDs.uid}, friend uid: ${userIDs.friendUid}`)

    queryMessagesDoc(userIDs.uid, userIDs.friendUid, userIDs.uid.localeCompare(userIDs.friendUid))
        .get()
        .then(querySnapshot => {
            if (!(querySnapshot.empty)) {
                let doc = querySnapshot.docs[0]
                return doc.data().texts
                //console.log(`retrieve texts retrieved 1: ${JSON.stringify(textsRetrieved)}`)
            }
            else {
                return []
            }
        })
        .then(texts => {
            return res.json({ texts })
        })

    //let texts = retrieveMessages(userIDs.uid, userIDs.friendUid)
    
    //console.log(`retrieved messages: ${JSON.stringify(texts)}`)
    //return res.json({ texts })
})


// Update messages after sending
app.post('/updatemessages', (req, res) => {
    let updatedTexts = JSON.parse(req.body)
    let uidOrder = updatedTexts.uid.localeCompare(updatedTexts.friendUid)

    
    /*db.collection('messages')
        .where('users', 'array-contains', updatedTexts.uid)
        .where('users', 'array-contains', updatedTexts.friendUid)*/
    

    queryMessagesDoc(updatedTexts.uid, updatedTexts.friendUid, uidOrder)
        .get()
        .then(querySnapshot => {
            if (querySnapshot.empty) {

                let users = (uidOrder < 0 ?
                    {
                        id1: updatedTexts.uid,
                        id2: updatedTexts.friendUid
                    } :
                    {
                        id1: updatedTexts.friendUid,
                        id2: updatedTexts.uid
                    })

                db.collection('messages').add({
                    users,
                    texts: updatedTexts.text
                })
                    .then(() => {
                        return res.json({ texts: updatedTexts.text })
                    })
                    .catch(err => {
                        return res.json({ error: err.code })
                    })
            }
            else {
                let doc = querySnapshot.docs[0]

                let docid = doc.id

                let newTexts = doc.data().texts
                newTexts.unshift(updatedTexts.text)
                
                /*db.collection('messages').doc(docid).update({
                    texts: firebase.firestore.FieldValue.arrayUnion(updatedTexts.text)
                })*/
                db.collection('messages').doc(docid).set({
                    texts: newTexts
                }, { merge: true })
                    .then(() => {
                        console.log(`new texts: ${JSON.stringify(newTexts)}`)
                        return res.json({ texts: newTexts })
                    })
                    .catch(err => {
                        return res.json({ error: err.code }) 
                    })
            }
        })
        .catch(err => {
            return res.json({ error: err.code }) 
        })
})


// Get user's messages
app.post('/messages', (req, res) => {
    const uid = JSON.parse(req.body).uid

    db.collection('users').doc(uid)
        .get()
        .then(docSnapshot => {
            if (docSnapshot.exists) {
                return docSnapshot.data()
            }
            else {
                return res.json({ error: 'user does not exist' })
            }
        })
        .then(data => {
            return res.json({ 
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email
            })
        })
})

app.post('/friendSearch', (req, res) => {
    let name = JSON.parse(req.body)
    if (name == '') {
        return res.json({ error: 'no name provided' })
    }

    let splitName = name.friend.split(' ')
    if (splitName.length !== 2) {
        return res.json({ error: 'invalid name' })
    }

    let firstName = splitName[0]
    let lastName = splitName[1]
    
    db.collection('users')
        .where('firstName', '==', firstName).where('lastName', '==', lastName)
        .get()
        .then(querySnapshot => {
            if (querySnapshot.empty) {
                return res.json({ error: 'user does not exist' })
            }
            let doc = querySnapshot.docs[0]
            let uid = doc.data().uid
            return res.json({ uid })
        })
        .catch(err => {
            return res.json({ error: err.code })
        })
})


// Sign-up
app.post('/signup', (req, res) => {
    const newUser = JSON.parse(req.body)
    let errors = {};

    /*
    for (let key of Object.keys(user)) {
        if (user[key] === '') errors[key] = `${key} is empty`
    }

    if (user.password !== user.confirmPassword) errors.confirmPassword = 'Passwords do not match'

    
    db.collection('users').doc(user.username)
        .get()
        .then(doc => {
            if (doc.exists) errors.username = 'Username is taken'
        })
    

    if (Object.keys(errors).length > 0) return res.status(400).json(errors)
    */
    
    //console.log(req.body)
    //console.log(newUser)
    //console.log(`type of email: ${typeof newUser.email}`)

    //res.header('Access-Control-Allow-Origin', '*')
    //return res.status(200).json({ success: 'true' })

    var userID;

    admin.auth().createUser({
        email: newUser.email,
        password: newUser.password,
    })
        .then(userRecord => {
            return userRecord.uid
        })
        .then(uid => {
            userID = uid

            let userCreds = {
                email: newUser.email,
                username: newUser.username,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                conversationsIds: [],
                password: newUser.password, // Remove later
                uid
            }

            return db.collection('users').doc(uid).set(userCreds)
        })
        .then(() => {
            admin.auth().createCustomToken(userID)
            .then(token => {
                console.log(`token: ${token}`)
                return res.json({ token })
            })
            .catch(err => {
                return res.json({ error: err.code })
            })
        })
        .catch(err => {
            message = err.code
            if (message === 'auth/email-already-in-use') {
                res.json({ email: 'Email already in use' })
            }
            else {
                res.json({ message })
            }
        })
})

// Login route
app.post('/login', (req, res) => {
    const user = JSON.parse(req.body)

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(userCred => {
            return userCred.user.uid
        })
        .then(uid => {
            admin.auth().createCustomToken(uid)
                .then(token => {
                    return res.json({ token, email: user.email })
                })
                .catch(err => {
                    return res.json({ error: err.code })
                })
        })
        .catch(err => {
            return res.json({ error: err.code })
        })
})

// Sign out
app.post('/logout', (req, res) => {
    firebase.auth().signOut()
        .catch(err => {
            return res.json({ err: err.code })
        })
})

exports.api = functions.https.onRequest(app)