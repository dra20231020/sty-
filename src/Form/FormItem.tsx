import React, { useEffect, useContext, } from "react";
import formContext from "./context";
import type { Rule } from "./type";

interface FormItemProps {
  label: string;
  name: string;
  rules?: Rule[];
  children: React.ReactNode;
}

const FormItem: React.FC<FormItemProps> = ({
  label,
  name,
  rules = [],
  children,
}) => {
  const form = useContext(formContext);
  
  // 组件挂载时，向实例注册当前字段的校验规则
  useEffect(() => {
    form.registerRules(name, rules);
  }, [form, name, rules]);

  return (
    <div style={{ margin: "10px 0" }}>
      <label style={{ display: "inline-block", width: "80px" }}>{label}</label>
      <div>
        {children}
        {form.errors[name] && (
          <div style={{ color: "red", fontSize: "12px" }}>
            {form.errors[name]}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormItem;
