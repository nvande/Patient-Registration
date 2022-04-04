import AppointmentComponent from '../components/AppointmentComponent.js';

import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useAuth0 } from "../react-auth0-spa";

function AppointmentsComponent() {
	const { getTokenSilently, loading, user, logout, isAuthenticated } = useAuth0();

	const [appts, setAppts] = useState([]);

	useEffect(() => {
		if (isAuthenticated) {
			fetchAppointments();
		}
	}, [user]);

	const fetchAppointments = () => {
		fetch('http://localhost:3007/api/appointments')
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
		<div>
			{isAuthenticated && <Button onClick={() => logout()}>Log out</Button>}
			{appts && appts.map((appt) => (
				<AppointmentComponent appt={appt} key={appt.id}/>
			))}
			{!appts &&
				<p className={'text-center'}>
					No upcoming or past appointments. When a patient makes an appointment, it will show up here.
				</p>
			}
		</div>
	)
	
}

export default AppointmentsComponent
