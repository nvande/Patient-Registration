import PageComponent from '../components/PageComponent.js';
import RegistrationComponent from '../components/RegistrationComponent.js';

function RegistrationPage() {
	return (
		<PageComponent>
			<div className="mt-5">
				<h1 className={"text-center"}>
					Patient Registration
				</h1>
				<RegistrationComponent/>
			</div>
		</PageComponent>
	);
}

export default RegistrationPage;
