import React, { Component } from "react";
import { v4 as uuidv4 } from "uuid";
import Input from "../components/Input";
import Select from "../components/Select";
import Form, { Field, FormStore } from "../components/my-rc-field-form";
const nameRules = { required: true, message: "请输入姓名！" };
const passworRules = { required: true, message: "请输入密码！" };

const formStore = new FormStore();
const form = formStore.getForm();

const schema = {
  type: "Form",
  props: {
    form: form,
    // ref：this.formRef,
    onFinish: (val) => {
      console.log("onFinish", val, null, "\t"); //sy-log
    },
    onFinishFailed: (val) => {
      console.log("onFinishFailed", val); //sy-log
    },
  },
  children: [
    {
      type: "FieldInput",
      props: {
        name: "username",
        placeholder: "username",
        rules: [nameRules],
      },
    },
    {
      type: "FieldInput",
      props: {
        name: "password",
        placeholder: "password",
        rules: [passworRules],
        dependences: ["username"],
        derivedProps: {
          renderIf: function (form) {
            const username = form.getFieldValue("username");
            return username === "hacker";
          },
        },
      },
    },
    {
      type: "FieldSelect",
      props: {
        name: "market",
        options: [
          { key: "male", text: "Male" },
          { key: "female", text: "female" },
        ],
      },
    },
    {
      type: "Button",
      props: {
        name: "Submit",
      },
    },
  ],
};

function populateKeyAutomatically(node) {
  if (!node.key) {
    node.key = uuidv4();
  }
  (node.children || []).forEach((subNode) => {
    subNode.key = subNode.key || uuidv4();
    populateKeyAutomatically(subNode);
  });
}

// console.log("before adding keys: " + JSON.stringify(schema, null, "\t"));
populateKeyAutomatically(schema);
// console.log("After adding keys: " + JSON.stringify(schema, null, "\t"));

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
    return React.createElement(ComponentProxy, childMetadata);
  });
  return React.createElement(componentMapper[type], props, childrenInstance);
}

export default class MyRCFieldForm extends Component {
  // formRef = React.createRef();
  // componentDidMount() {
  //   console.log("form", this.formRef.current); //sy-log
  //   this.formRef.current.setFieldsValue({ username: "default" });
  // }
  render() {
    return (
      <div>
        <h3>MyRCFieldForm</h3>
        <ComponentProxy {...schema} />
      </div>
    );
  }
}
