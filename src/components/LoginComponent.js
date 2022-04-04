import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

function LoginComponent() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const [errors, setErrors] = useState([]);

	return (
		<div>
			<Form.Group controlId="formUsername">
				<Form.Label>Username</Form.Label>
			    <Form.Control
			    	value={username}
			    	name="username"
			    	onChange={(e) => setUsername(e.target.value)}
			    	required
			    	type="text"
			    	isInvalid={errors.first_name}
			    />
			    <Form.Control.Feedback type="invalid">
	        		{errors.first_name && errors.first_name.join(", ")}
	      		</Form.Control.Feedback>
			</Form.Group>
			<Form.Group controlId="formPassword">
				<Form.Label>Password</Form.Label>
			    <Form.Control
			    	value={password}
			    	name="password"
			    	onChange={(e) => setPassword(e.target.value)}
			    	type="password"
			    	isInvalid={errors.middle_initial}
			    />
			    <Form.Control.Feedback type="invalid">
	        		{errors.middle_initial && errors.middle_initial.join(", ")}
	      		</Form.Control.Feedback>
			</Form.Group>
			<div className="d-grid">
				<Button className={"mt-4"}>Login</Button>
			</div>
		</div>
	);
}

export default LoginComponent;