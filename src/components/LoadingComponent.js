import { Container } from 'react-bootstrap';
import { FaHeartbeat } from 'react-icons/fa';

function LoadingComponent(props){
	return (
		<Container className={'text-center mt-5 loadingComponent'}>
			<FaHeartbeat className={"loadingIcon"}/>
			<span className={'d-block'}>Loading...</span>
		</Container>
	);
}

export default LoadingComponent;