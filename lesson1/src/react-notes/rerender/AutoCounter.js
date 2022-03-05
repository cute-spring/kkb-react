import React, { useState, useReducer } from "react";
import "./rerender.css";

const AutoCounterUseState = () => {
  console.log("counter render");
  const [count, addCount] = useState(0);
  setInterval(() => {
    addCount(new Date().getSeconds());
  }, 5000);
  return (
    <div className="counter">
      <div className="counter-num">Seconds : {count}</div>
    </div>
  );
};

//create your forceUpdate hook
function useForceUpdate() {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  return forceUpdate; // update the state to force render
}

function AutoCounterUseRef() {
  const forceUpdate = useForceUpdate();
  const counter = React.useRef(0);
  console.log("counter render : " + counter.current);
  setInterval(() => {
    counter.current++;
  }, 3000);
  return (
    <div className="counter">
      <div className="counter-num">Seconds : {counter.current}</div>
      <button onClick={forceUpdate}>Refresh</button>
    </div>
  );
}

const CounterWithoutChangeReference = () => {
  console.log("counter render");
  const [count, addCount] = useState({ num: 0, time: Date.now() });
  const forceUpdate = useForceUpdate();
  const clickHandler = () => {
    count.num++;
    count.time = Date.now();
    addCount(count);
  };
  return (
    <div className="counter">
      <div className="counter-num">
        {count.num}, {count.time}
      </div>
      <button onClick={clickHandler}>add</button>
      <button onClick={forceUpdate}>forceUpdate</button>
    </div>
  );
};

export {
  AutoCounterUseState,
  AutoCounterUseRef,
  CounterWithoutChangeReference,
};
