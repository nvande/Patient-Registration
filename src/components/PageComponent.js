import FooterComponent from './FooterComponent.js';

const footer = "This website is for demonstration purposes only.";

function PageComponent(props) {
  return (

    <div className={'container prBody mt-sm-5'}>
      {props.children}
      <FooterComponent footer={footer}/>
    </div>
    
  );
}

export default PageComponent;