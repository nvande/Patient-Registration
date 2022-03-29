function FooterComponent(props){
	return (
		<div className={'text-center mt-5 mb-2 text-muted'}>
			{props.footer}
		</div>
	);
}

export default FooterComponent;