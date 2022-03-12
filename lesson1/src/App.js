// import AntdFormPage from "./pages/AntdFormPage";
import MyRCFieldForm from "./pages/MyRCFieldForm";
// import {
//   CounterWithoutChangeReference,
//   AutoCounterUseRef,
// } from "./react-notes/rerender/AutoCounter";
const jexl = require("jexl");

const context = {
  name: { first: "Sterling", last: "Archer" },
  assoc: [
    { first: "Lana", last: "Kane" },
    { first: "Cyril", last: "Figgis" },
    { first: "Pam", last: "Poovey" },
  ],
  age: 36,
};
window.jexl = jexl;
const res = jexl.evalSync('assoc[.first == "Lana"].last', context);
// Filter an array asynchronously...
console.log(res); // Output: Kane

export default function App(props) {
  return (
    <div>
      {/* <AntdFormPage /> */}
      <MyRCFieldForm />
      {/* <CounterWithoutChangeReference /> */}
      {/* <AutoCounterUseRef /> */}
    </div>
  );
}
