import React, { Component } from "react";
import ComponentProxy from "../components/ComponentProxy";
import { FormStore } from "../components/my-rc-field-form";
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
      type: "FieldSelect",
      props: {
        name: "tool",
        label: "f/e tool",
        options: [
          { key: "react", text: "react" },
          { key: "vue", text: "vue" },
        ],
      },
    },
    {
      type: "FieldInput",
      props: {
        name: "password",
        label: "password",
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
      type: "FieldInput",
      props: {
        name: "username",
        label: "username",
        placeholder: "username",
        rules: [nameRules],
        derivedProps: {
          renderIf: function (form) {
            const tool = form.getFieldValue("tool");
            return tool === "vue";
          },
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
