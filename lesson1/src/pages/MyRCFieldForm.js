import React, { Component } from "react";
import ComponentProxy, { addInternalKey } from "../components/ComponentProxy";
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
    // {
    //   type: "FieldInput",
    //   props: {
    //     name: "bankName",
    //     label: "Bank Name",
    //     placeholder: "Bank Name",
    //   },
    // },
    {
      type: "FieldSelect",
      props: {
        name: "country",
        label: "Country/Region",
        options: [
          { key: "--", text: "Please select" },
          { key: "55", text: "China" },
          { key: "74", text: "Egypt" },
          { key: "84", text: "France" },
        ],
      },
    },
    {
      type: "FieldSelect",
      props: {
        name: "titleId",
        label: "Title",
        options: [
          { key: "--", text: "Please select" },
          { key: "01", text: "Mr" },
          { key: "02", text: "Mrs" },
          { key: "03", text: "Ms" },
          { key: "04", text: "Miss" },
          { key: "05", text: "Mx" },
          { key: "06", text: "Others" },
        ],
      },
    },
    {
      type: "FieldSelect",
      props: {
        name: "documentTypeId",
        label: "Document Type",
        options: [
          { key: "--", text: "Please select" },
          { key: "4896", text: "Corporate Registry Extract" },
          { key: "4897", text: "Certificate of Incorporation" },
          { key: "4898", text: "Bussiness Registration Certificate" },
          { key: "4899", text: "Evidence of listing" },
          { key: "4900", text: "Evidence of regulation" },
        ],
      },
    },
    {
      type: "FieldSelect",
      props: {
        name: "tool",
        label: "f/e tool",
        options: [
          { key: "--", text: "Please select" },
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

        // derivedProps2: {
        //   args: [
        //     {
        //       name: "username",
        //       type: "Input",
        //       path: "username",
        //       accessLevel: "private",
        //     },
        //     {
        //       name: "expectedUserName",
        //       type: "constant",
        //       value: "hacker",
        //     },
        //   ],
        //   computed: {
        //     visible: "username === expectedUserName", //predicate expression
        //   },
        // },
        // dependences: ["username"],
        // derivedProps: {
        //   renderIf: function (form) {
        //     const username = form.getFieldValue("username");
        //     return username === "hacker";
        //   },
        // },
      },
    },
    {
      type: "FieldInput",
      props: {
        name: "username",
        label: "username",
        placeholder: "username",
        rules: [nameRules],
        derivedProps2: {
          args: [
            {
              name: "tool",
              type: "Input",
              path: "tool",
              accessLevel: "private",
            },
            {
              name: "expectedTool",
              type: "constant",
              value: "vue",
            },
          ],
          computed: {
            renderIf: "tool == expectedTool", //predicate expression
          },
        },
        dependences: ["tool"],
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

addInternalKey("k", [schema]);
console.log(schema);

schema.children = [
  {
    type: "FieldInput",
    props: {
      name: "bankName",
      label: "Bank Name",
      placeholder: "Bank Name",
    },
  },
  ...schema.children,
];
addInternalKey("k", [schema]);
console.log(schema);
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

// derivedProps2: {
// args: [
//   type : Input|constant|asynfn
// {
// name: "country",
// type: "Input",
// path: "country",
// accessLevel: "private",
// },
// {
// name: "ageOfMajority",
// type: "constant",
// value: 18,
// },
// {
// name: "ageOfMajority",
// type: "constant",

// * accessLevel : package|private <br>
// * private: the default value which is only visible by the element itself.<br>
// * package: visible by the element itself and the sub element under this element.

// accessLevel: "package",

// No limitation to the value

// value: 18,
// },
// ],
// [key:string]:
// computed: {
// visible: "expr", //predicate expression
// readonly: "expr", //predicate expression
// mandatory: "expr", //predicate expression
// validation: [
// { rule: "expr", msg: "" },
// { rule: "expr", msg: "" },
// ],
// overwrite: {
// predicate: "expr",
// value: "expr",
// },
// default: {
// predicate: "expr",
// value: "expr",
// },
// customizedProps_xxx: {
// predicate: "expr",
// value: "expr",
// },
// customizedProps_yyy: {
// predicate: "expr",
// value: "expr", // boolean,number,array,json, expressionString,functionRef???
// },
// },
// },
/**       
         derivedProps2: {
           args: [
             //type : Input|constant|asynfn
             {
               name: "username",
               type: "Input",
               path: "person.username",
               accessLevel: "private",
             },
             {
               name: "ageOfMajority",
               type: "constant",
               value: 18,
             },
             {
               name: "ageOfMajority",
               type: "constant",
              //  
              //   * accessLevel : package|private <br>
              //   * private: the default value which is only visible by the element itself.<br>
              //   * package: visible by the element itself and the sub element under this element.
              //   
               accessLevel: "package",
              //  
              //   No limitation to the value
              //   
               value: 18,
             },
           ],
           // [key:string]:
           computed: {
             visible: "expr", //predicate expression
             readonly: "expr", //predicate expression
             mandatory: "expr", //predicate expression
             validation: [
               { rule: "expr", msg: "" },
               { rule: "expr", msg: "" },
             ],
             overwrite: {
               predicate: "expr",
               value: "expr",
             },
             default: {
               predicate: "expr",
               value: "expr",
             },
             customizedProps_xxx: {
               predicate: "expr",
               value: "expr",
             },
             customizedProps_yyy: {
               predicate: "expr",
               value: "expr", // boolean,number,array,json, expressionString,functionRef???
             },
           },
         },
         */
