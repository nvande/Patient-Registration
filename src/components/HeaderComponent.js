import { FaUserMd } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import { useAuth0 } from "../react-auth0-spa";

function HeaderComponent(props){
	const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

	return (
		<div className={'mt-3 mt-sm-5 px-5 pt-3 pb-1 text-muted pageHeader bg-info text-white clearfix'}>
			<Link to='/'>
				<h1 className='text-white'><FaUserMd className={'iconInline'}/> Faux Health </h1>
			</Link>
			{ isAuthenticated &&
				<div className="d-inline">
					<Button className={"float-end mt-1 mb-3"} onClick={()=>logout({ returnTo: `http://localhost:3000` })}>Log Out</Button>
					<img src={user.picture} height="50" className="float-end rounded-circle img-thumbnail mt-0 me-4 userPhoto"/>
					<span className="float-end my-2 me-2 h4 h-100 align-middle text-white">{user.nickname}</span>

				</div>
			}
		</div>
	);
}

export default HeaderComponent;