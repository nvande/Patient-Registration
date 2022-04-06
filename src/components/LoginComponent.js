import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useAuth0 } from "../react-auth0-spa";

function LoginComponent() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const [errors, setErrors] = useState([]);
	const { isAuthenticated, loginWithRedirect, loginWithPopup, logout } = useAuth0();

	return (
		<div>
			<div className="d-grid gap-2">
				<Button onClick={()=> loginWithRedirect({})}> Sign in with Auth0 </Button>
			</div>
		</div>
	);
}

export default LoginComponent;