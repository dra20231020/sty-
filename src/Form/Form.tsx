import React, { useState, useEffect } from "react";
import FormContext from "./context";
export interface FormProps {
  children?: React.ReactNode;
  form?: any;
  onFinish?: (values: Record<string, any>) => void;
}
export const Form = ({ form, children, onFinish }: FormProps) => {
  const [, setStateForm] = useState(form);
  useEffect(() => {
    // 注册更新UI回调
    form.registerUpdate(() => {
      // 状态更新完毕，触发组件重新渲染
      setStateForm({});
    });
  }, [form]);

  // 提交按钮点击时触发实例的 submit 方法
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    form.onSubmit(onFinish);
  };

  return (
    <FormContext.Provider
      value={{
        ...form,
      }}
    >
      <form onSubmit={handleSubmit}>{children}</form>
    </FormContext.Provider>
  );
};

export default Form;
