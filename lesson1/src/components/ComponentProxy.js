import React from "react";
import { v4 as uuidv4 } from "uuid";
import Input from "../components/Input";
import Form, { Field } from "../components/my-rc-field-form";
import Select from "../components/Select";

const wrapWithLabel = (Comp) => (props) => {
  const { label, ...restProps } = props;
  const id = restProps.id || uuidv4();
  return (
    <div style={{ padding: "10px" }}>
      <label htmlFor={id}>{label} : </label>
      <Comp {...restProps} id={id} />
    </div>
  );
};

const wrapWithField = (Comp) => (props) => {
  return (
    <Field {...props}>
      <Comp />
    </Field>
  );
};

const LabelInput = (props) => wrapWithLabel(Input)(props);
const FieldInput = (props) => wrapWithField(LabelInput)(props);

const LabelSelect = (props) => wrapWithLabel(Select)(props);
const FieldSelect = (props) => wrapWithField(LabelSelect)(props);

function Button() {
  return <button>Submit</button>;
}

const componentMapper = {
  Form: Form,
  FieldInput: FieldInput,
  Button: Button,
  FieldSelect: FieldSelect,
};
export function addInternalKey(parentKey, children = []) {
  let sequence = children.filter((metadata, index) => {
    return !!metadata.props.__key__;
  }).length;
  children.forEach((metadata) => {
    const { props, children } = metadata;
    if (!props.__key__) {
      props.__key__ = `${parentKey}_${sequence++}`;
    }
    addInternalKey(props.__key__, children);
  });
}
function ComponentProxy(schema) {
  const { type, props, children } = schema;
  const childrenInstance = children?.map((childMetadata) => {
    childMetadata.key = childMetadata.key || uuidv4();
    return React.createElement(ComponentProxy, childMetadata);
  });
  return React.createElement(componentMapper[type], props, childrenInstance);
}

export default ComponentProxy;
