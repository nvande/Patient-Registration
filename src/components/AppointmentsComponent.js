import AppointmentComponent from '../components/AppointmentComponent.js';

import { useState, useEffect } from 'react';
import { Button, Row } from 'react-bootstrap';
import { useAuth0 } from "../react-auth0-spa";
import config from "../config.json";

function AppointmentsComponent() {
	const { getTokenSilently, loading, user, logout, isAuthenticated } = useAuth0();

	const [appts, setAppts] = useState([]);


	useEffect(() => {
		if (isAuthenticated) {
			fetchAppointments();
		}
	}, [user]);

	const fetchAppointments = async() => {
		const token = await getTokenSilently();
		const options = {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`
			}
		}
		fetch(`${config.server_url}/api/appointments`, options)
        .then(res => res.json())
        .then((data) => {
          	setAppts(data.data);
        })
        .catch(console.log)
	};

	if (loading) {
	    return <div className={"text-center"}>Loading...</div>;
	}

	if (!user) {
		return <div className={"text-center"}>Please log in before viewing appointments</div>;
	}

	return (
		<Row>
			{appts && appts.map((appt) => (
				<AppointmentComponent appt={appt} key={appt.id} isFull={false} multiple={appts.length > 1}/>
			))}
			{!appts &&
				<p className={'text-center'}>
					No upcoming or past appointments. When a patient makes an appointment, it will show up here.
				</p>
			}
		</Row>
	)
	
}

export default AppointmentsComponent
