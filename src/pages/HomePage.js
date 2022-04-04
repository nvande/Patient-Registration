import PageComponent from '../components/PageComponent.js';
import LoginComponent from '../components/LoginComponent.js'

import { Button, Container, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function HomePage() {
	return (
		<PageComponent>
			<div className="mt-5">
				<Container>
					<Row>
						<Col className="text-center">
							<h1 className="mt-5">
								Patient Registration
							</h1>
							<p>
								New patient?
							</p>
							<Link to="/register"><Button size="lg">Register for an appointment</Button></Link>
						</Col>
						<Col md="4">
							<h3>
								Admin Login
							</h3>
							<p>
								Log in here to check which appointments have already been made.
							</p>
							<LoginComponent/>
						</Col>
					</Row>
				</Container>
			</div>
		</PageComponent>
	);
}

export default HomePage;