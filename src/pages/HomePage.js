import PageComponent from '../components/PageComponent.js';
import LoginComponent from '../components/LoginComponent.js'
import config from "../config.json";

import React from 'react';
import { useState, useEffect } from 'react';
import { useAuth0 } from "../react-auth0-spa";

import { Button, Container, Col, Row, Alert } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';

function HomePage() {
	const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
	const [ searchParams, setSearchParams ] = useSearchParams();
	const [ error, setError ] = useState(false);

	useEffect(() => {
		setError(searchParams.has('error'))

	}, [searchParams]);

	return (
		<PageComponent>
			<div className="mt-5">
				<Container>
					{ error && 
			 	      <Alert variant="danger" onClose={() => setError(false)} dismissible>
				        <Alert.Heading>{searchParams.get('error')}</Alert.Heading>
				        <p>
				          {searchParams.get('error_description')}
				        </p>
				      </Alert>
				    }
					<Row>
						{!isAuthenticated && 
							<React.Fragment>
								<Col className="text-center">
									<img className={"img-responsive"} src={`${config.server_url}/images/patient.jpg`}/>
									<h1 className="mt-5">
										Patient Registration
									</h1>
									<p>
										New patient?
									</p>
									<Link to="/register"><Button size="lg">Register for an appointment</Button></Link>
								</Col>
								<Col md="6" lg="3">
									<h3 className="mt-5">
										Admin Login
									</h3>
									<p>
										Log in here to check which appointments have already been made.
									</p>
									<LoginComponent/>
								</Col>
							</React.Fragment>
						}
						{isAuthenticated && 
							<Col className="text-center">
							<img className={"img-responsive"} src={`${config.server_url}/images/doctors.jpg`}/>
								<h1 className="mt-5">
									View Appointments
								</h1>
								<p>
									See past & future patient appointments here.
								</p>
								<Link to="/appointments"><Button size="lg">View Appointments</Button></Link>
							</Col>
						}
					</Row>
				</Container>
			</div>
		</PageComponent>
	);
}

export default HomePage;