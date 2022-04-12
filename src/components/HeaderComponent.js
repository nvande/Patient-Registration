import { FaUserMd } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Button, Container, Row, Col } from 'react-bootstrap';

import { useAuth0 } from "../react-auth0-spa";

function HeaderComponent(props){
	const { isAuthenticated, loading, loginWithRedirect, logout, user } = useAuth0();

	return (
		<Container className={'mt-3 mt-sm-5 px-md-3 px-lg-5 pt-3 pb-0 pb-md-2 text-muted text-center text-md-start pageHeader bg-info text-white clearfix'}>
			<Row>
				<Col sm="12" md="6">
					<Link to='/'>
						<h2 className='text-white mt-2 mt-md-0 mb-3 mb-md-0 text-center text-md-start pageTitle'><FaUserMd className={'iconInline'}/> Patient Registration </h2>
					</Link>
				</Col>
				{ isAuthenticated && !loading &&
					<Col sm="12" md="6">
						<div className="d-inline">
							<Button className={"float-end mt-0 mt-md-0 mb-2"} onClick={()=>logout({ returnTo: `http://localhost:3000` })}>Log Out</Button>
							<img src={user.picture} className="float-start float-md-end rounded-circle img-thumbnail mt-0 mt-md-0 me-2 me-md-4 userPhoto"/>
							<span className="float-start float-md-end mt-2 me-2 h6 h-100 align-middle text-white">{user.nickname}</span>
						</div>
					</Col>
				}
			</Row>
		</Container>
	);
}

export default HeaderComponent;