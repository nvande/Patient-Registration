import PageComponent from '../components/PageComponent.js';
import AppointmentsComponent from '../components/AppointmentsComponent.js';

function RegistrationPage() {
	return (

		<PageComponent>
			<div className="mt-5">
				<h3 className={"text-center"}>
					Appointments
				</h3>
			</div>
			<AppointmentsComponent/>
		</PageComponent>
	);
}

export default RegistrationPage;
