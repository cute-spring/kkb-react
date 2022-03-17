import produce from "immer";
const jexl = require("jexl");

const derivedPropsByKey = {};

const generateArgsContext = (args = [], getFieldValue) => {
  const argsCtx = {};
  args.forEach((item) => {
    const { type, name, path, value } = item;
    if (type === "Input") {
      const fieldValue = getFieldValue(path);
      argsCtx[name] = fieldValue;
    } else if (type === "constant") {
      argsCtx[name] = value;
    }
  });
  return argsCtx;
};
function getNextState(prevState, derivedPropsDef, getFieldValue) {
  return produce(prevState, (draft) => {
    const { args, computed = {} } = derivedPropsDef;
    if (args) {
      const argsCtx = generateArgsContext(args, getFieldValue);
      Object.keys(computed).forEach((key) => {
        const expressionRule = computed[key];
        const res = jexl.evalSync(expressionRule, argsCtx);
        console.log("argsCtx : %o", argsCtx);
        console.log("expression rule : '%s'", expressionRule);
        console.log("%s : %s", key, res);
        draft[key] = res;
      });
    }
  });
}
function DerivedPropsResolver({ getFieldValue }) {
  return {
    getDerivedProps: (props) => {
      const { derivedProps2: derivedPropsDef, name, __key__ } = props;
      derivedPropsByKey[__key__] = derivedPropsByKey[__key__] || {};
      const prevState = derivedPropsByKey[__key__];
      let nextState = prevState;
      let hasDiff = false;
      if (derivedPropsDef !== undefined) {
        console.group("derivedProps2 - [%s] - [%s]", name, __key__);
        nextState = getNextState(prevState, derivedPropsDef, getFieldValue);
        hasDiff = prevState !== nextState;
        derivedPropsByKey[__key__] = nextState;
        console.log({ nextState, prevState, hasDiff });
        console.groupEnd("derivedProps2 - [%s] - [%s]", name, __key__);
      }

      return { nextState, prevState, hasDiff };
    },
  };
}
export default DerivedPropsResolver;
