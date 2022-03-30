import PageComponent from '../components/PageComponent.js';

import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

function HomePage() {
	return (
		<PageComponent>
			<div className="mt-5">
				<h1>
					Patient Registration
				</h1>
				<p>
					New patient?
				</p>
				<Link to="/register"><Button>Register for an appointment</Button></Link>
			</div>
		</PageComponent>
	);
}

export default HomePage;