import React from "react";
import FormStore from "./FormStore";
// 存储状态管理库的
export default function useForm(form) {
  // 我现在需要一个值，这个值在组件的整个生命周期中会被存储下来

  const formRef = React.useRef();

  if (!formRef.current) {
    if (form) {
      formRef.current = form;
    } else {
      const formStore = new FormStore();
      formRef.current = formStore.getForm();
    }
  }

  return [formRef.current];
}
