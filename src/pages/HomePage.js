import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

function HomePage() {
	return (
		<div className="mt-5">
			<h1>
				Patient Registration
			</h1>
			<p>
				New patient? Click here to register for an appointment:
			</p>
			<Link to="/register"><Button>Register for an appointment</Button></Link>
		</div>
	);
}

export default HomePage;