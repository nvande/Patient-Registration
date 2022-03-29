function PageComponent(props) {
  return (
    <div className={'container prBody mt-sm-5'}>
      {props.children}
    </div>
  );
}

export default PageComponent;