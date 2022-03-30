import { useState } from 'react';

import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import DateTimePicker from 'react-datetime-picker';
import DatePicker from 'react-date-picker';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';

import { FaUser, FaIdCard, FaCalendarPlus } from 'react-icons/fa';

function handleChange() {

}

function RegistrationComponent() {

	const [name, setName] = useState({
		first: '',
		middle: '',
		last: ''
	});
	const [dob, setDob] = useState('');
	const [phone,setPhone] = useState(0);
	const [email, setEmail] = useState('');
	const [address, setAddress] = useState({
		line1: '',
		line2: '',
		city: '',
		country: '',
		region: '',
		postal: ''

	})
	
	const [apptDate, setApptDate] = useState('');

	const [errors, setErrors] = useState('');

	const [values, setValues] = useState({});

	const changeHandler = (e, funct) =>{
		const {name, value} = e.target;
        funct(prev => ({...prev, [name]: value}));
    };

    const regionHandler = (name, value) => {
    	setAddress(prev => ({...prev, [name]: value}));
    };

	return (
		<div>
			<Form>
				<h4 className={"mt-5 lead"}><FaUser className="stepIcon"/> Patient Information </h4>
			 	<Container className="my-3">
					<Row>
						<Col xs={8} sm={8} lg={5} className={"mb-2 mb-md-4"}>
							<Form.Group controlId="formFirstName">
								<Form.Label>First name</Form.Label>
							    <Form.Control value={name.first} name="first" onChange={(e) => changeHandler(e,setName)} required type="text" />
							</Form.Group>
						</Col>
				    	<Col xs={4} lg={2} className={"mb-2 mb-md-4"}>
				    		<Form.Group controlId="formMiddleName">
				    			<Form.Label>Middle initial</Form.Label>
							    <Form.Control value={name.middle} name="middle" onChange={(e) => changeHandler(e,setName)} type="text" placeholder="(optional)" />
							</Form.Group>
				    	</Col>
				    	<Col sm={12} lg={5} className={"mb-2 mb-md-4"}>
				    		<Form.Group controlId="formLastName">
				    			<Form.Label>Last name</Form.Label>
							    <Form.Control value={name.last} name="last" onChange={(e) => changeHandler(e,setName)} required type="text" />
							</Form.Group>
				    	</Col>
					</Row>
					<Row>
						<Col xs={12} md={4} className={"mb-2 mb-md-4"}>
							<Form.Group controlId="formDOB">
								<Form.Label>Day of Birth</Form.Label>
								<DatePicker
									inputProps = {{required:true}}
									value={dob}
									onChange={setDob}
								/>
							</Form.Group>
						</Col>
						<Col xs={12} md={4} className={"mb-2 mb-md-4"}>
							<Form.Group controlId="formPhone">
								<Form.Label>Phone Number</Form.Label>
								<PhoneInput
								  country={'us'}
								  value={phone}
								  onChange={phone => setPhone(phone)}
								/>
							</Form.Group>
						</Col>
						<Col xs={12} md={4} className={"mb-2 mb-md-4"}>
							<Form.Group controlId="formEmail">
								<Form.Label>Email</Form.Label>
								<Form.Control value={email} onChange={(event) => {setEmail(event.target.value);}} required type="text" />
							</Form.Group>
						</Col>
					</Row>
					<Row>
						<Form.Group
			              as={Col}
			              md="6"
			              controlId="formAddress"
			              className="position-relative mb-2 mb-md-4"
			            >
			              <Form.Label>Address</Form.Label>
			              <Form.Control
			                type="text"
			                name="line1"
			                className="mb-2"
			                value={address.line1}
			                onChange={(e) => changeHandler(e,setAddress)}
			                isInvalid={!!errors.address}
			                required
			              />
			            </Form.Group>
			            <Form.Group
			              as={Col}
			              md="6"
			              controlId="formAddress2"
			              className="position-relative mb-2 mb-md-4"
			            >
			              <Form.Label>Apartment / Suite</Form.Label>
			              <Form.Control
			                type="text"
			                name="line2"
			                value={address.line2}
			                onChange={(e) => changeHandler(e,setAddress)}
			                isInvalid={!!errors.address}
			                required
			              />
			              <Form.Control.Feedback type="invalid" tooltip>
			                {errors.city}
			              </Form.Control.Feedback>
			            </Form.Group>
			            <Form.Group
			              as={Col}
			              lg="4"
			              md="5"
			              controlId="formCity"
			              className="position-relative mb-2 mb-md-4"
			            >
			              <Form.Label>City</Form.Label>
			              <Form.Control
			                type="text"
			                name="city"
			                value={address.city}
			                onChange={(e) => changeHandler(e,setAddress)}
			                isInvalid={!!errors.city}
			                required
			              />

			              <Form.Control.Feedback type="invalid" tooltip>
			                {errors.city}
			              </Form.Control.Feedback>
			            </Form.Group>
			            <Form.Group
			            	as={Col}
			            	xs='12'
			            	md='7'
			            	lg='3'
			            	controlId="formCountry"
			            >	
			            	<Form.Label>Country</Form.Label>
					        <CountryDropdown
					          value={address.country}
					          onChange={(val) => regionHandler('country',val)}
					          classes={'selectCountry mb-2 mb-md-4'}
					        />
					    </Form.Group>
					    <Form.Group
			            	as={Col}
			            	xs='8'
			            	md='8'
			            	lg='3'
			            	controlId="formRegion"
			            >	
					    	<Form.Label>{address.country == "United States" ? 'State / Province' : 'Region'}</Form.Label>     
					        <RegionDropdown
					          country={address.country} 
					          value={address.region}
					          onChange={(val) => regionHandler('region',val)}
					          classes={'selectRegion mb-2 mb-md-4'}
					          defaultOptionLabel={address.country == "United States" ? 'Select State / Province' : 'Select Region'}
					        />
					    </Form.Group>
			            <Form.Group
			              as={Col}
			              lg="2"
			              md="4"
			              xs="4"
			              controlId="formPostal"
			              className="position-relative mb-2 mb-md-4"
			            >
			              <Form.Label>{address.country == "United States" ? 'ZIP Code' : 'Postal Code' }</Form.Label>
			              <Form.Control
			                type="text"
			                name="postal"
			                value={address.postal}
			                onChange={(e) => changeHandler(e,setAddress)}
			                isInvalid={!!errors.postal}
			                required
			              />

			              <Form.Control.Feedback type="invalid" tooltip>
			                {errors.postal}
			              </Form.Control.Feedback>
			            </Form.Group>
			        </Row>
			    </Container>
			    <Container>
			    	<Row>
			    		<Col md="6" className="d-none d-md-block">
			    			<h5 className={"mt-5 lead"}><FaIdCard className="stepIcon"/> Upload Image of Patient's Driver's License </h5>
			    			<Form.Label>Supported File Extensions: JPEG, PNG</Form.Label>
			    		</Col>
			    		<Col md="6" className="d-none d-md-block">
			    			<h5 className={"mt-5 lead"}><FaCalendarPlus className="stepIcon"/> Select Appointment Day & Time </h5>
			    		</Col>
			    	</Row>
			    	<Row>
				        <Form.Group
				        	as={Col}
				        	md="6"
				        >
				        	<h5 className={"mt-5 d-md-none lead"}><FaIdCard className="stepIcon"/> Upload Image of Patient's Driver's License</h5>
				            <Form.Control
				              type="file"
				              required
				              name="file"
				              onChange={handleChange}
				              isInvalid={!!errors.file}
				              required
				            />
				            <Form.Control.Feedback type="invalid" tooltip>
				              {errors.file}
				            </Form.Control.Feedback>
				        </Form.Group>
						<Form.Group
							controlId="formFirstName"
							as={Col}
							md="6"
						>
							<h5 className={"d-md-none mt-5 lead"}><FaCalendarPlus className="stepIcon"/> Select Appointment Day & Time </h5>
							<DateTimePicker
								inputProps = {{required:true}}
								value={apptDate}
								onChange={setApptDate}
								disableClock
							/>
						</Form.Group>
					</Row>
				</Container>
			    <div className={'text-center mt-5'}>
					<Button className={'px-5'} variant="primary" type="submit">
				    	Register
					</Button>
			    </div>
			</Form>
		</div>
	);
}

export default RegistrationComponent;
