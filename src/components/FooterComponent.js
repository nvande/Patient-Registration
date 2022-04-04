function FooterComponent(props){
	return (
		<div className={'text-center mt-5 mb-5 text-muted footer'}>
			<small>{props.footer}</small>
		</div>
	);
}

export default FooterComponent;