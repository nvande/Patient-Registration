import PageComponent from '../components/PageComponent.js';

import { Button, Container, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function HomePage() {
	return (
		<PageComponent>
			<div className="mt-5">
				<Container>
					<Row>
						<Col>
							<h1>
								Patient Registration
							</h1>
							<p>
								New patient?
							</p>
							<Link to="/register"><Button>Register for an appointment</Button></Link>
						</Col>
						<Col>
							<h1>
								Admin
							</h1>
							<p>
								Check which appointments have already been made.
							</p>
							<Link to="/appointments"><Button>View Appointments</Button></Link>
						</Col>
					</Row>
				</Container>
			</div>
		</PageComponent>
	);
}

export default HomePage;