import React, { Component } from "react";
import FieldContext from "./FieldContext";
import * as R from "ramda";

class Field extends Component {
  static contextType = FieldContext;

  derivedPropsMap = new Map();

  constructor(props) {
    super(props);
    //To avoid being rendered first time (Mount) and then being hidden immediately caused by the derived props.
    this.derivedPropsMap.set("renderIf", false);
  }

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

  onStoreChange = (keys) => {
    const { name, dependences = [], derivedProps = {} } = this.props;

    let isRequiredToUpdate = false;
    if (R.includes(name, keys)) {
      isRequiredToUpdate = true;
    } else if (R.intersection(keys, dependences).length > 0) {
      isRequiredToUpdate = true;
    }

    Object.keys(derivedProps).forEach((key) => {
      const fn = derivedProps[key];
      let newProp = fn(this.context);
      if (newProp !== this.derivedPropsMap.get(key)) {
        isRequiredToUpdate = true;
        this.derivedPropsMap.set(key, newProp);
      }
    });

    const doesRenderIfDefined = derivedProps.hasOwnProperty("renderIf");
    //add this one by default and expect this to be overwritten
    if (doesRenderIfDefined === false) {
      this.derivedPropsMap.set("renderIf", true);
    }

    /**
     * clean up input value
     */
    const fieldValue = this.context.getFieldValue(name);
    const isRequiredToRender = this.derivedPropsMap.get("renderIf");
    if (fieldValue !== undefined && isRequiredToRender === false) {
      this.context.delFieldValue(this);
    }

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

    const {
      name,
      rule,
      children,
      dependences,
      derivedProps: originalDerivedProps,
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
