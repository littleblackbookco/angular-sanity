export function HelloWorldAction(props) {
  return {
    label: "Hello world",
    onHandle: () => {
      window.alert(JSON.stringify(props));
    },
  };
}
