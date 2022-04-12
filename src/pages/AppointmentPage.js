import PageComponent from '../components/PageComponent.js';
import AppointmentComponent from '../components/AppointmentComponent.js';
import LoadingPage from '../pages/LoadingPage';

import { useAuth0 } from "../react-auth0-spa";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";

function AppointmentPage() {
	const [appt, setAppt] = useState(null);
	const { getTokenSilently, loading, user, logout, isAuthenticated } = useAuth0();

	const { id } = useParams();

	useEffect(() => {
		if (isAuthenticated) {
			fetchAppointment();
		}
	}, [user]);

	const fetchAppointment = async() => {
		const token = await getTokenSilently();
		const options = {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`
			}
		}
		fetch(`http://localhost:3007/api/appointment/${id}`, options)
        .then(res => res.json())
        .then((data) => {
          	setAppt(data.data);
        })
        .catch(console.log)
	};

	const dateString = appt ? format(parseISO(appt.appt_time), "MMMM do, yyyy 'at' h:mm a") : "Loading...";

	if (loading || !appt) {
	    return <LoadingPage/>;
	}

	return (

		<PageComponent>
			<div className="mt-4">
				<h3 className={"text-center mb-3"}>
					Appointment for {appt.patient.firstname} {appt.patient.middle} {appt.patient.lastname}
				</h3>
				<span className={"d-block mb-4 text-center lead"}>
					{dateString}
				</span>
			</div>
			{ appt && <AppointmentComponent appt={appt} isFull={true}/> }
		</PageComponent>
	);
}

export default AppointmentPage;
