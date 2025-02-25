export default (props) => {
  return (
    <div class={`p-4 w-full flex flex-col justify-start ${props.class}`}>
      {props.children}
    </div>
  );
};
