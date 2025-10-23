import React,{useContext} from "react";
import formContext from "./context";

interface InputProps {
  name: string;
  type?: string;
}
const Input: React.FC<InputProps> = ({ name, type = "text" }) => {
  const form = useContext(formContext);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 调用实例的 setFieldsValue 更新值
    form?.setFieldsValue({ [name]: e.target.value });
  };

  

  return (
    <input
      value={form.values[name] || ""}
      onChange={handleChange}
      type={type}
    />
  );
};

export default Input;
