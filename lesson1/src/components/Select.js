import React from "react";

class Select extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { options, ...otherProps } = this.props;
    return (
      <select {...otherProps}>
        {options.map((item) => (
          <option key={`key-${item.key}`} value={item.key}>
            {item.text}
          </option>
        ))}
      </select>
    );
  }
}

export default Select;
