import { FaUserMd } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function HeaderComponent(props){
	return (
		<div className={'mt-3 mt-sm-5 px-5 pt-3 pb-1 text-muted pageHeader bg-info text-white'}>
			<Link to='/'>
				<h1 className='text-white'><FaUserMd className={'iconInline'}/> Faux Health </h1>
			</Link>
		</div>
	);
}

export default HeaderComponent;