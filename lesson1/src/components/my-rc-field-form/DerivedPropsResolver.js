const jexl = require("jexl");

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

const EMPTY = {};

function DerivedPropsResolver(props, { getFieldValue }) {
  // eslint-disable-next-line no-unused-vars
  const { derivedProps2: derivedPropsDef, name, __key__, ...restProps } = props;
  return {
    getDerivedProps: () => {
      if (derivedPropsDef === undefined) {
        return EMPTY;
      }
      const result = {};
      const { args, computed = {} } = derivedPropsDef;
      if (args) {
        const argsCtx = generateArgsContext(args, getFieldValue);
        console.group("derivedProps2 - [%s] - [%s]", name, __key__);
        Object.keys(computed).forEach((key) => {
          const expressionRule = computed[key];
          const res = jexl.evalSync(expressionRule, argsCtx);
          console.log("argsCtx : %o", argsCtx);
          console.log("expression rule : '%s'", expressionRule);
          console.log("%s : %s", key, res);
          result[key] = res;
        });
        console.groupEnd("derivedProps2 - [%s] - [%s]", name, __key__);
      }
      return result;
    },
  };
}
export default DerivedPropsResolver;
