function FooterComponent(props){
	return (
		<div className={'text-center mt-3 mb-3 text-muted footer'}>
			<small>{props.footer}</small>
		</div>
	);
}

export default FooterComponent;