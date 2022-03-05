import React, { Component } from "react";
import { v4 as uuidv4 } from "uuid";
import Input from "../components/Input";
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
        visible: true,
      },
    },
    {
      type: "FieldInput",
      props: {
        name: "password",
        placeholder: "password",
        rules: [passworRules],
        dependences: ["username"],
        derivedFuntion: function (form) {
          console.debug(form);
          const username = form.getFieldValue("username");
          return { visible: username === "hacker" };
        },
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

console.log("before adding keys: " + JSON.stringify(schema, null, "\t"));
populateKeyAutomatically(schema);
console.log("After adding keys: " + JSON.stringify(schema, null, "\t"));

function FieldInput(props) {
  const { name, rules, placeholder, ...restProps } = props;
  return (
    <Field name={name} rules={rules} {...restProps}>
      <Input placeholder={placeholder} />
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
};

function ComponentProxy(schema) {
  //   const [derivedProps, setDerivedProps] = useState({});
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
