import { Card, Button, ListGroup, ListGroupItem, Container, Row, Col } from 'react-bootstrap';

import { format, parseISO } from "date-fns";
import { FaUser, FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import config from "../config.json";

function AppointmentComponent({appt, isFull, multiple}) {
	var date1 = new Date();
	var date2 = new Date(appt.appt_time);

	var Difference_In_Time = date2.getTime() - date1.getTime();
	var Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
	var sign = Difference_In_Days;

	let text = Math.abs(Difference_In_Days)+" ";
	let headerClass = "bg-primary text-white";
	let btnClass = "btn-primary"
	if(sign > 0){
		text += "Days Away";
	} else if (sign < 0) {
		text += "Days Ago";
		headerClass = "bg-secondary text-white";
		btnClass = "btn-secondary"
	} else {
		text = "Today"
		headerClass = "bg-warning text-white";
		btnClass = "btn-warning"
	}

	let address = `${appt.patient.address.address1} ${appt.patient.address.address2} ${appt.patient.address.city},`+
		` ${appt.patient.address.region} ${appt.patient.address.country} ${appt.patient.address.postal}`;

	console.log(appt);

	return (
		<Col lg={!isFull && multiple ? "6" : "12"}>
		<Card className={"mb-5"} >
		<Card.Header as="h5" className={headerClass}><span className={"badge badge-pill badge-light float-right"}><FaClock className="iconInline"/> {text}</span></Card.Header>
			<Card.Body>
				<Container>
				  <Row>
				    <Col>
				    	<Card.Title as={isFull ? "h1" : "h4"}>{appt.patient.lastname}, {appt.patient.firstname} {appt.patient.middle}{appt.patient.middle.length > 0 ? "." : ""}</Card.Title>
						<Card.Subtitle className="mb-2 text-muted">{appt.patient.phone}</Card.Subtitle>
				    </Col>
				    {!isFull ?
				    	<Col>
				    		<h4 className={"text-end"}>{format(parseISO(appt.appt_time), "MMMM do, yyyy")}</h4>
				    		<h4 className={"text-end"}>{format(parseISO(appt.appt_time), "'@' h:mm (a)")}</h4>
				    	</Col>
				    	:
				    	<Col>
				    		<img height="200" className={"float-end"} src={`${config.server_url}/images/${appt.patient.photo}`}/>
				    	</Col>
					}
				  </Row>
			</Container>
			</Card.Body>
			<ListGroup className="list-group-flush">
			      <ListGroupItem><b>Date of birth:</b> {appt.patient.dob}</ListGroupItem>
			      <ListGroupItem><b>Address:</b> {address}</ListGroupItem>
			      <ListGroupItem><b>Email:</b> {appt.patient.email}</ListGroupItem>
			</ListGroup>
			{!isFull &&
				<Card.Body className={"text-end"}>
					<Link to={`/appointment/`+appt.id}><Button className={btnClass}>View Appointment</Button></Link>
				</Card.Body>
			}
		</Card>
		{isFull &&
			<div className={"text-center"}>
				<Link to={'/appointments/'}><Button size="lg">Return to Appointments List</Button></Link>
			</div>
		}
		</Col>
	)
	
}

export default AppointmentComponent;