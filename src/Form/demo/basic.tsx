import React from "react";
import useForm from "../useForm";
import Form from "../Form";
import FormItem from "../FormItem";
import Input from "../Input";

const MyFormPage = () => {
  const [form] = useForm({ username: "", age: "" });
  // 2. 提交成功回调
  const onFinish = (values: any) => {
    console.log("提交成功", values);
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <FormItem
        label="用户名"
        name="username"
        rules={[{ required: true, message: "请输入用户名" }]}
      >
        <Input name="username"  />
      </FormItem>
      <FormItem
        label="年龄"
        name="age"
        rules={[
          { required: true, message: "请输入年龄" },
          { validator: (val) => (val < 18 ? "必须年满18岁" : undefined) },
        ]}
      >
        <Input name="age" type="number" />
      </FormItem>
      <button type="submit">提交</button>
    </Form>
  );
};

export default MyFormPage;
