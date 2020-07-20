import React from 'react'

class FriendSearch extends React.Component {
    doSelect = (e) => {
        let name = e.target.value
        this.props.doSelectFriend(name)
    }
    
    render() {
        return (
            <div>
                <h3>Select a friend:</h3>
                <select 
                    id="friends" 
                    size="3"
                    onChange={this.doSelect}
                >
                    <option selected disabled hidden value=''></option>
                    {this.props.conversations.map(friend => (
                        <option value={friend.name}>{friend.name}</option>
                    ))}
                </select>
            </div>
        )
    }
}

export default FriendSearch;