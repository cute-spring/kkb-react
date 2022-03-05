import React, { Component } from "react";
import FieldContext from "./FieldContext";
import * as R from "ramda";

class Field extends Component {
  static contextType = FieldContext;

  derivedPropsMap = new Map();

  componentDidMount() {
    this.unregister = this.context.setFieldEntities(this);
    this.onStoreChange([this.props.name]);
  }

  componentWillUnmount() {
    if (this.unregister) {
      this.unregister();
    }
  }

  onStoreChange = (keys) => {
    const { name, dependences = [], derivedProps } = this.props;
    if (R.includes(name, keys)) {
      this.forceUpdate();
      return;
    }

    if (R.intersection(keys, dependences).length === 0 || !derivedProps) {
      return;
    }

    let isRequiredToUpdate = false;
    Object.keys(derivedProps).forEach((key) => {
      const fn = derivedProps[key];
      let newProp = fn(this.context);
      if (newProp !== this.derivedPropsMap.get(key)) {
        isRequiredToUpdate = true;
        this.derivedPropsMap.set(key, newProp);
      }
    });
    if (isRequiredToUpdate) {
      this.forceUpdate();
    }
  };

  getControlled = () => {
    if (this.derivedPropsMap.get("renderIf") === false) {
      return { renderIf: false };
    }
    const derivedProps = {};
    this.derivedPropsMap.forEach((value, name) => {
      derivedProps[name] = value;
    });

    const { name } = this.props;
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
      ...derivedProps,
    };
  };

  render() {
    const updatedProps = this.getControlled();
    if (updatedProps?.renderIf === false) {
      return null;
    }
    console.log("render"); //sy-log
    const { children } = this.props;
    const returnChildNode = React.cloneElement(children, updatedProps);
    return returnChildNode;
  }
}
export default Field;
