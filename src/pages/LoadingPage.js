import PageComponent from '../components/PageComponent.js';
import LoadingComponent from '../components/LoadingComponent';

function LoadingPage() {
	return (
		<PageComponent>
			<div className="mt-5">
				<LoadingComponent/>
			</div>
		</PageComponent>
	);
}

export default LoadingPage;
