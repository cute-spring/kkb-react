import React, { Component } from "react";
import FieldContext from "./FieldContext";
import lodash from "lodash";

class Field extends Component {
  static contextType = FieldContext;

  componentDidMount() {
    this.unregister = this.context.setFieldEntities(this);
  }

  componentWillUnmount() {
    if (this.unregister) {
      this.unregister();
    }
  }

  onStoreChange = (keys) => {
    const { dependences } = this.props; //derivedFuntion,
    if (dependences && lodash.intersection(keys, dependences).length > 0) {
      this.forceUpdate();
    }
  };

  // function FieldInput(props) {

  //   return (
  //     <Field name={name} rules={rules}>
  //       <Input placeholder={placeholder} style={styleWrapper} />
  //     </Field>
  //   );
  // }

  getControlled = () => {
    const { derivedFuntion, ...restProps } = this.props;
    const mergedProps = { ...restProps };
    if (derivedFuntion) {
      const derivedProps = derivedFuntion(this.context);
      Object.assign(mergedProps, derivedProps);
    }

    const style = mergedProps?.visible ? {} : { display: "none" };

    const { name } = this.props;
    const { getFieldValue, setFieldsValue } = this.context;
    return {
      value: getFieldValue(name), //"omg", //get(name) store
      style: style,
      onChange: (e) => {
        const newVal = e.target.value;
        // store set（name）
        setFieldsValue({
          [name]: newVal,
        });
        // console.log("newVal", newVal); //sy-log
      },
    };
  };

  render() {
    console.log("render"); //sy-log
    const { children } = this.props;
    const returnChildNode = React.cloneElement(children, this.getControlled());
    return returnChildNode;
  }
}
export default Field;
