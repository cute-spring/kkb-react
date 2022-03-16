import React, { Component } from "react";
import FieldContext from "./FieldContext";
import * as R from "ramda";
import DerivedPropsResolver from "./DerivedPropsResolver";
// const jexl = require("jexl");

class Field extends Component {
  static contextType = FieldContext;

  derivedPropsMap = new Map();
  derivedProps2Map = new Map();
  // constructor(props) {
  //   super(props);
  //To avoid being rendered first time (Mount) and then being hidden immediately caused by the derived props.
  // this.setDerivedProp("renderIf", false);
  // }

  componentDidMount() {
    this.unregister = this.context.setFieldEntities(this);
    this.onStoreChange([this.props.name]);
  }

  componentWillUnmount() {
    if (this.unregister) {
      this.context.delFieldValue(this);
      this.unregister();
    }
  }

  dependences;

  onStoreChange = (keys) => {
    const {
      name,
      dependences = [],
      derivedProps: derivedPropsDef = {},
    } = this.props;

    let isRequiredToUpdate = false;
    if (R.includes(name, keys)) {
      isRequiredToUpdate = true;
    } else if (R.intersection(keys, dependences).length > 0) {
      isRequiredToUpdate = true;
    }

    if (isRequiredToUpdate === false) {
      return;
    }
    
    const derivedPropsResolver = DerivedPropsResolver(this.props, this.context);
    // console.log();
    derivedPropsResolver.getDerivedProps();

    Object.keys(derivedPropsDef).forEach((key) => {
      const fn = derivedPropsDef[key];
      let newProp = fn(this.context);
      if (newProp !== this.getDerivedProp(key)) {
        isRequiredToUpdate = true;
        this.setDerivedProp(key, newProp);
      }
    });

    /**
     * clean up input value
     */
    const fieldValue = this.context.getFieldValue(name);
    const isRequiredToRender = this.getDerivedProp("renderIf");
    if (fieldValue !== undefined && isRequiredToRender === false) {
      this.context.delFieldValue(this);
    }

    if (isRequiredToUpdate) {
      this.forceUpdate();
    }
  };

  getDerivedProp = (propName) => {
    return this.derivedPropsMap.get(propName);
  };
  setDerivedProp = (propName, value) => {
    this.derivedPropsMap.set(propName, value);
  };
  getDerivedProps = () => {
    const derivedProps = {};
    this.derivedPropsMap.forEach((value, name) => {
      derivedProps[name] = value;
    });
    return derivedProps;
  };

  getControlled = () => {
    if (this.getDerivedProp("renderIf") === false) {
      return { renderIf: false };
    }
    const derivedProps = this.getDerivedProps();

    const {
      name,
      rule,
      children,
      dependences,
      derivedProps: originalDerivedProps,
      derivedProps2,
      ...restProps
    } = this.props;
    const { getFieldValue, setFieldsValue } = this.context;
    return {
      value: getFieldValue(name), //"omg", //get(name) store
      onChange: (e) => {
        const newVal = e.target.value;
        // store set（name）
        setFieldsValue({
          [name]: newVal,
        });
        // console.log("newVal", newVal); //sy-log
      },
      ...restProps,
      ...derivedProps,
    };
  };

  render() {
    const updatedProps = this.getControlled();
    if (updatedProps?.renderIf === false) {
      //doesn't render only when renderIf is false exactly, otherwise, if it's true or undefined, go ahead to render.
      return null;
    }
    delete updatedProps["renderIf"];
    console.log("render : " + this.props.name); //sy-log
    const { children } = this.props;
    const returnChildNode = React.cloneElement(children, updatedProps);
    return returnChildNode;
  }
}
export default Field;
