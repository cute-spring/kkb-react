import React from "react";

class Select extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { options, ...otherProps } = this.props;
    return (
      <div style={{ padding: 10 }}>
        <select {...otherProps}>
          {options.map((item) => (
            <option key={`key-${item.key}`} value={item.key}>
              {item.text}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

export default Select;
