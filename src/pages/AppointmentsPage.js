import PageComponent from '../components/PageComponent.js';
import AppointmentsComponent from '../components/AppointmentsComponent.js';

import { useAuth0 } from "../react-auth0-spa";

function AppointmentsPage() {
	return (

		<PageComponent>
			<div className="mt-5">
				<h1 className={"text-center mb-5"}>
					Appointments
				</h1>
			</div>
			<AppointmentsComponent/>
		</PageComponent>
	);
}

export default AppointmentsPage;
