import React from "react";
import { v4 as uuidv4 } from "uuid";
import Input from "../components/Input";
import Form, { Field } from "../components/my-rc-field-form";
import Select from "../components/Select";

function FieldInput(props) {
  const { name, rules, ...restProps } = props;
  return (
    <Field name={name} rules={rules} {...restProps}>
      <Input />
    </Field>
  );
}

function FieldSelect(props) {
  const { name, rules, placeholder, ...restProps } = props;
  return (
    <Field name={name} rules={rules} {...restProps}>
      <Select />
    </Field>
  );
}

function Button() {
  return <button>Submit</button>;
}

const componentMapper = {
  Form: Form,
  FieldInput: FieldInput,
  Button: Button,
  FieldSelect: FieldSelect,
};

function ComponentProxy(schema) {
  const { type, props, children } = schema;
  const childrenInstance = children?.map((childMetadata) => {
    childMetadata.key = childMetadata.key || uuidv4();
    return React.createElement(ComponentProxy, childMetadata);
  });
  return React.createElement(componentMapper[type], props, childrenInstance);
}

export default ComponentProxy; //{ populateKeyAutomatically, ComponentProxy };
