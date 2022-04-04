import { useState, useEffect } from 'react';

import AppointmentComponent from '../components/AppointmentComponent.js';

function AppointmentsComponent() {
	const [appts, setAppts] = useState([]);

	useEffect(() => {
		fetchAppointments();
	}, []);

	const fetchAppointments = () => {
		fetch('http://localhost:3007/api/appointments')
        .then(res => res.json())
        .then((data) => {
          	setAppts(data.data);
        })
        .catch(console.log)
	};

	return (
		<div>
			{appts.map((appt) => (
				<AppointmentComponent appt={appt} key={appt.id}/>
			))}
		</div>
	)
	
}

export default AppointmentsComponent
