import { Container } from 'react-bootstrap';
import { FaHeartbeat } from 'react-icons/fa';

function LoadingComponent(props){
	return (
		<Container className={'text-center mt-5 mb-5 loadingComponent'}>
			<FaHeartbeat className={"loadingIcon"}/>
		</Container>
	);
}

export default LoadingComponent;