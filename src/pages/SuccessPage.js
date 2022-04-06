import PageComponent from '../components/PageComponent.js';
import config from "../config.json";

import React from 'react';
import { useEffect, useState } from 'react';
import { useAuth0 } from "../react-auth0-spa";
import { format, parseISO } from "date-fns";

import { Button, Container, Col, Row } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';

function SuccessPage() {
	const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
	const [searchParams, setSearchParams] = useSearchParams();
	const [time ,setTime] = useState(null);

	useEffect(() => {
		setTime(searchParams.get('time'))
	}, [searchParams]);

	return (
		<PageComponent>
			<div className="mt-5">
				<Container>
					<Row>
						<Col className="text-center">
						<img className={"img-responsive"} src={`${config.server_url}/images/schedule.jpg`}/>
							<h2 className="my-5">
								Success! Your appointment has been made.
							</h2>
							
							{time ?
								<React.Fragment>
									<h4 className={"mt-5 lead"}> We look forward to seeing you on </h4>
									<h4 className={"lead mb-5"}>{format(parseISO(time), "MMMM do, yyyy 'at' h:mm a")}</h4>
				    			</React.Fragment>
				    			:
				    			<React.Fragment>
									<h4 className={"my-5 lead"}> We look forward to seeing you then! </h4>
				    			</React.Fragment>
							}
							<Link to="/"><Button size="lg">Return to home</Button></Link>
						</Col>
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

export default SuccessPage;