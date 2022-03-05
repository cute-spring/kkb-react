对于函数组件的 re-render，大致分为以下三种情况：

- 组件本身使用 useState 或 useReducer 更新，引起的 re-render；

- 父组件更新引起的 re-render；

- 组件本身使用了 useContext，context 更新引起的 re-render。
