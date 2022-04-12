import { useState, Fragment } from 'react';

import { Container, Row, Col, Button, Form, Alert, InputGroup } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import DateTimePicker from 'react-datetime-picker';
import DatePicker from 'react-date-picker';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';

import { FaUser, FaIdCard, FaCalendarPlus } from 'react-icons/fa';
import { format, parseISO, parse, getTime } from "date-fns";

import constraints from '../validate/validate.js';

function RegistrationComponent() {
	const validate = require("validate.js");

	validate.extend(validate.validators.datetime, {
	  parse: function(value, options) {
	    return getTime(parseISO(value));
	  },
	  format: function(value, options) {
	    var format = options.dateOnly ? "yyyy-MM-dd" : "yyyy-MM-dd hh:mm:ss";
	    return format(value, format);
	  }
	});

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
	});
	const [photo, setPhoto] = useState('');
	const [apptTime, setApptTime] = useState('');

	const [imageUploaded, setImageUploaded] = useState(false);
	const [uploadedImageName, setUploadedImageName] = useState(null);

	const [error, setError] = useState(false);
	const [errors, setErrors] = useState([]);
	const [success, setSuccess] = useState(false);
	const [redirect, setRedirect] = useState(null);
	const [validation, setValidation] = useState(undefined);

	const handleFile = e => {
		setPhoto(e.target.files[0]);
	}

	const changeHandler = (e, funct) => {
		const {name, value} = e.target;
        funct(prev => ({...prev, [name]: value}));
    };

    const regionHandler = (name, value) => {
    	setAddress(prev => ({...prev, [name]: value}));
    };

    const redirectSuccess = (time) => {
    	setRedirect(`/success?time=${time}`);
    };

    const uploadFile = () => {
    	let formData = new FormData();
    	formData.append("licenseImage", photo);

    	let requestOptions = null;
    	try {
	    	requestOptions = {
		        method: 'POST',
		        body: formData,
		    };
		} catch (error) {
			console.error(error);
			setError(true);
		}
		if (requestOptions) {
		    fetch('http://localhost:3007/api/license', requestOptions)
	        	.then(res => res.json())
	        	.then((data) => {
	        		setImageUploaded(data.success);
	        		setUploadedImageName(data.data);
	          		setError(!data.success);
	        	})
	        	.catch(error => {
	        		console.error(error);
	        		setError(true);
	        	});
        }
    };

    const removeImage = () => {
    	setPhoto('');
    	setImageUploaded(false);
    	setUploadedImageName(null);
    }

    const validateFields = () => {
    	const dates = formatDates();
    	let errors = validate({
    		first_name: name.first,
    		middle_initial: name.middle,
    		last_name: name.last,
    		date_of_birth: dates.dob,
    		phone_number:phone,
	        email_address:email,
	        address:address.line1,
			apartment:address.line2,
			city:address.city,
			country:address.country,
			region:address.region,
			postal:address.postal,
			license_image: uploadedImageName,
			appointment_time: dates.appt,
    	}, constraints);
    	if(errors && errors.length != 0){
    		setErrors(errors);
    		setError("Please fix the following issues before resubmitting: "+validationToString(errors));
    		return false;
    	} else {
    		setErrors([]);
    	}
    	return true;
    }

    function validationToString (obj) {
	    let str = '';
	    for (const [p, val] of Object.entries(obj)) {
	        str += `* ${val.join('. ')}. \n`;
	    }
	    return str;
	}

    const formatDates = () => {
    	let [ formattedDob, formattedAppt ] = [ null, null ];
    	try {
    		formattedDob = format(new Date(dob), "yyyy-MM-dd");
    		formattedAppt = format(new Date(apptTime), "yyyy-MM-dd HH:mm:ss");
    	} catch (error) {
    		//console.log(error);
    		// setError("Error formatting dates. Please try again or contact support.");
    	}
    	return {
    		'dob': formattedDob,
    		'appt': formattedAppt
    	};
    }

    const postRegistration = () => {
    	if(!validateFields()){
    		return;
    	}
    	
    	if(!imageUploaded) {
    		setError("Please upload an image before registering an appointment.");
    		return
    	}

    	const dates = formatDates();
    	let requestOptions = null;
    	try {
	    	requestOptions = {
		        method: 'POST',
		        headers: { 'Content-Type': 'text/plain' },
		        body: JSON.stringify({
	         		patient:
	        		{
	        			firstname:name.first,
	        			middle:name.middle,
	        			lastname:name.last,
	        			dob:dates.dob,
	        			phone:phone,
	        			email:email,
	        			address:
	        			{
	    					address1:address.line1,
	    					address2:address.line2,
	    					city:address.city,
	    					country:address.country,
	    					region:address.region,
	    					postal:address.postal
	        			},
	        			photo:uploadedImageName
	        		},
		        	appt_time: dates.appt,
		        })
		    };
		} catch (error) {
			console.error(error);
			setError("Error while preparing the form data. Please try again or contact support.");
		}
		if (requestOptions) {
		    fetch('http://localhost:3007/api/appointment', requestOptions)
	        	.then(res => res.json())
	        	.then((data) => {
	          		if(!data.success){
	          			setError("Error while making the registration. Please try again or contact support.");
	          		} else {
	          			redirectSuccess(data.data.appt_time);
	          		}
	        	})
	        	.catch(error => {
	        		console.error(error);
	        		setError("Error while making the registration. Please try again or contact support.");
	        	});
        }
    };

    if(redirect) {
    	return (
    		<Navigate to={redirect}/>
    	);
    }

	return (
		<div>
			<Form>
				<h4 className={"mt-3 lead"}><FaUser className="stepIcon"/> Patient Information </h4>
			 	<Container className="my-3">
			 		{ error && 
			 	      <Alert variant="danger" onClose={() => setError(false)} dismissible>
				        <Alert.Heading>Unable to make this appointment</Alert.Heading>
				        <p>
				          {error}
				        </p>
				      </Alert>
				    }
				    { success && 
			 	      <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
				        <Alert.Heading>Successfully made appointment!</Alert.Heading>
				        <p>
				          See you then!
				        </p>
				      </Alert>
				    }
					<Row>
						<Col xs={8} sm={8} lg={5} className={"mb-2 mb-md-4"}>
							<Form.Group controlId="formFirstName">
								<Form.Label>First name</Form.Label>
							    <Form.Control
							    	value={name.first}
							    	name="first"
							    	onChange={(e) => changeHandler(e,setName)}
							    	required
							    	type="text"
							    	isInvalid={errors.first_name}
							    />
							    <Form.Control.Feedback type="invalid">
			                		{errors.first_name && errors.first_name.join(", ")}
			              		</Form.Control.Feedback>
							</Form.Group>
						</Col>
				    	<Col xs={4} lg={2} className={"mb-2 mb-md-4"}>
				    		<Form.Group controlId="formMiddleName">
				    			<Form.Label>Middle init.</Form.Label>
							    <Form.Control
							    	value={name.middle}
							    	name="middle"
							    	onChange={(e) => changeHandler(e,setName)}
							    	type="text"
							    	placeholder="(optional)"
							    	isInvalid={errors.middle_initial}
							    />
							    <Form.Control.Feedback type="invalid">
			                		{errors.middle_initial && errors.middle_initial.join(", ")}
			              		</Form.Control.Feedback>
							</Form.Group>
				    	</Col>
				    	<Col sm={12} lg={5} className={"mb-2 mb-md-4"}>
				    		<Form.Group controlId="formLastName">
				    			<Form.Label>Last name</Form.Label>
							    <Form.Control
							    	value={name.last}
							    	name="last"
							    	onChange={(e) => changeHandler(e,setName)}
							    	required
							    	type="text"
							    	isInvalid={errors.last_name}
						    	/>
						    	<Form.Control.Feedback type="invalid">
			                		{errors.last_name && errors.last_name.join(", ")}
			              		</Form.Control.Feedback>
							</Form.Group>
				    	</Col>
					</Row>
					<Row>
						<Col xs={12} md={4} className={"mb-2 mb-md-4"}>
							<Form.Group controlId="formDOB">
								<Form.Label>Date of Birth</Form.Label>
								<DatePicker
									inputProps = {{required:true}}
									value={dob}
									onChange={setDob}
									maxDate={new Date()}
									className={errors.date_of_birth ? 'is-invalid' : ''}
								/>
								<Form.Control.Feedback type="invalid">
			                		{errors.date_of_birth && errors.date_of_birth.join(", ")}
			              		</Form.Control.Feedback>
							</Form.Group>
						</Col>
						<Col xs={12} md={4} className={"mb-2 mb-md-4"}>
							<Form.Group controlId="formPhone">
								<Form.Label>Phone Number</Form.Label>
								<PhoneInput
								  country={'us'}
								  value={phone}
								  onChange={phone => setPhone(phone)}
								  className={errors.phone_number ? 'is-invalid' : ''}
								/>
								<Form.Control.Feedback type="invalid">
			                		{errors.phone_number && errors.phone_number.join(", ")}
			              		</Form.Control.Feedback>
							</Form.Group>
						</Col>
						<Col xs={12} md={4} className={"mb-2 mb-md-4"}>
							<Form.Group controlId="formEmail">
								<Form.Label>Email</Form.Label>
								<Form.Control
									value={email}
									onChange={(event) => {setEmail(event.target.value);}}
									required
									type="text"
									isInvalid={errors.email_address}
								/>
								<Form.Control.Feedback type="invalid">
			                		{errors.email_address && errors.email_address.join(", ")}
			              		</Form.Control.Feedback>
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
			                required
			                isInvalid={errors.address}
			              />
			              <Form.Control.Feedback type="invalid">
			              	{errors.address}
			              </Form.Control.Feedback>
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
			                required
			                placeholder="(optional)"
			                isInvalid={errors.apartment}
			              />
			              <Form.Control.Feedback type="invalid">
			              	{errors.apartment}
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
			                required
			                isInvalid={errors.city}
			              />
			              <Form.Control.Feedback type="invalid">
			              	{errors.city}
			              </Form.Control.Feedback>
			            </Form.Group>
			            <Form.Group
			            	as={Col}
			            	xs='12'
			            	md='7'
			            	lg='3'
			            	controlId="formCountry"
			            	className="mb-2 mb-md-4"
			            >	
			            	<Form.Label>Country</Form.Label>
					        <CountryDropdown
					          value={address.country}
					          onChange={(val) => regionHandler('country',val)}
					          classes={`selectCountry ${errors.country ? 'is-invalid' : ''}`}
					        />
						    <Form.Control.Feedback type="invalid">
				            	{errors.country}
				            </Form.Control.Feedback>
					    </Form.Group>
					    <Form.Group
			            	as={Col}
			            	xs='8'
			            	md='8'
			            	lg='3'
			            	controlId="formRegion"
			            	className="mb-2 mb-md-4"
			            >	
					    	<Form.Label>{address.country == "United States" ? 'State / Province' : 'Region'}</Form.Label>     
					        <RegionDropdown
					          country={address.country} 
					          value={address.region}
					          onChange={(val) => regionHandler('region',val)}
					          classes={`selectRegion ${errors.country ? 'is-invalid' : ''}`}
					          defaultOptionLabel={address.country == "United States" ? 'Select State / Province' : 'Select Region'}
					        />
					        <Form.Control.Feedback type="invalid">
				            	{errors.region}
				            </Form.Control.Feedback>
					    </Form.Group>
			            <Form.Group
			              as={Col}
			              lg="2"
			              md="4"
			              xs="4"
			              controlId="formPostal"
			              className="position-relative mb-2 mb-md-4"
			            >
			              <Form.Label>{address.country == "United States" ? 'ZIP Code' : 'Postal' }</Form.Label>
			              <Form.Control
			                type="text"
			                name="postal"
			                value={address.postal}
			                onChange={(e) => changeHandler(e,setAddress)}
			                required
			                isInvalid={errors.postal}
			              />
			              <Form.Control.Feedback type="invalid">
			                {errors.postal}
			              </Form.Control.Feedback>
			            </Form.Group>
			        </Row>
			    </Container>
			    <Container>
			    	<Row>
			    		<Col md="6" className="d-none d-md-block">
			    			<h5 className={"mt-5 lead"}><FaIdCard className="stepIcon"/> Upload Image of Patient's Driver's License </h5>
			    			<Form.Label>Supported File Extensions: JPG, JPEG, PNG, GIF</Form.Label>
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
				        	{ !imageUploaded ?
					        	<InputGroup>
						            <Form.Control
						              type="file"
						              required
						              name="file"
						              onChange={handleFile}
						              isInvalid={errors.license_image}
						            />
						            <Button variant="outline-secondary" id="button-addon2" onClick={uploadFile}>
								      Upload Image
								    </Button>
								    <Form.Control.Feedback type="invalid">
					                	{errors.license_image}
					              	</Form.Control.Feedback>
						        </InputGroup>
						        :
						        <Fragment>
							        <div className={'uploadedImage mb-3 border'}>
							        	<img src={URL.createObjectURL(photo)}/>
							        </div>
							        <Button variant="outline-secondary" id="button-addon2" onClick={removeImage}>
									      Remove Image
									</Button>
								</Fragment>
						    }
				        </Form.Group>
						<Form.Group
							controlId="formFirstName"
							as={Col}
							md="6"
						>
							<h5 className={"d-md-none mt-5 lead"}><FaCalendarPlus className="stepIcon"/> Select Appointment Day & Time </h5>
							<DateTimePicker
								inputProps = {{required:true}}
								value={apptTime}
								onChange={setApptTime}
								disableClock
								minDate={new Date()}
								className={errors.appointment_time ? 'is-invalid' : ''}
							/>
							<Form.Control.Feedback type="invalid">
			                	{errors.appointment_time}
			              	</Form.Control.Feedback>
						</Form.Group>
					</Row>
				</Container>
			    <Container className={'text-center mt-5'}>
				    <Row>
				    	<Col className={'text-center'}>
						    <Link to="/">
						    	<Button className={'px-5 mb-2 float-md-end'} variant="secondary" size="lg">
							    Cancel
								</Button>
							</Link>
						</Col>
						<Col>
							<Button className={'px-5 ms-md-3 float-md-start'} variant="primary" size="lg" onClick={postRegistration}>
						    	Register
							</Button>
						</Col>
					</Row>
			    </Container>
			</Form>
		</div>
	);
}

export default RegistrationComponent;
