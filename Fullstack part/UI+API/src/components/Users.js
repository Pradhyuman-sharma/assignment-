import React from 'react';
import { getUsers } from '../repository';
//import { Link } from 'react-router-dom';

export default class UserList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			users: []
		}
	}

	componentWillMount() {
		getUsers().then((users) => {
            console.log(users)
	      this.setState({ users });
	    });
	}

	render() {
		const { users } =  this.state;
		return (
			<div class = "container">
            <h3 className="card-title">List of Available Users</h3>
            <hr/>
      {users.map((user,index) => (
        <div key={index}>
          <h4 className="card-title">{index+1}. {user.name}</h4>
        </div>
      ))}
    </div>
		);
	}
}
