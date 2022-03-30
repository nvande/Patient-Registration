import { useState, useEffect } from 'react';

function AppointmentsComponent() {
	const [appts, setAppts] = useState([]);

	useEffect(() => {
		fetch('http://localhost:3007/api/appointments')
        .then(res => res.json())
        .then((data) => {
        	console.log(data);
          	setAppts(data);
        })
        .catch(console.log)
	});

	return (
		<div>
			{appts}
		</div>
	)
	
}

export default AppointmentsComponent
