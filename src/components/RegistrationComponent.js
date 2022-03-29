import { Container, Row, Col, Button, Form } from 'react-bootstrap';

function RegistrationComponent() {
	return (
		<div>
			<Form>
			 	<Container className="my-3">
					<Row>
						<Col xs={12} sm={8} lg={5} className={"mb-2 mb-md-4"}>
							<Form.Group controlId="formFirstName">
							    <Form.Control type="text" placeholder="First name" />
							</Form.Group>
						</Col>
				    	<Col xs={12} sm={4} lg={2} className={"mb-2 mb-md-4"}>
				    		<Form.Group controlId="formMiddleName">
							    <Form.Control type="text" placeholder="Middle initial" />
							</Form.Group>
				    	</Col>
				    	<Col md={12} lg={5} className={"mb-2 mb-md-4"}>
				    		<Form.Group controlId="formLastName">
							    <Form.Control type="text" placeholder="Last name" />
							</Form.Group>
				    	</Col>
					</Row>
					<Row>
				    	<Col>1 of 3</Col>
				    	<Col>2 of 3</Col>
				    	<Col>3 of 3</Col>
				  	</Row>
				</Container>
			  
			  <div className={'text-center'}>
				  <Button className={'px-5'} variant="primary" type="submit">
				    Register
				  </Button>
			  </div>
			</Form>
		</div>
	);
}

export default RegistrationComponent;