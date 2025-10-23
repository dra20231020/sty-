import { useRef } from "react";
import type { Rules, FormInstance } from "./type";
// 将表单状态封装成实例
function useForm(initialValues = {}): [FormInstance] {
  // 存储表单数据
  const formValuesRef = useRef<Record<string, any>>(initialValues);
  // 存储表单校验规则
  const formRulesRef = useRef<Record<string, Rules>>({});
  // 存储错误信息对象
  const errorsRef = useRef<Record<string, string>>({});
  // 存储任务更新函数
  const updateRef = useRef<() => void>(null);
  // 注册更新UI回调
  const registerUpdate = (updateFn: () => void) => {
    updateRef.current = updateFn;
  };
  // 注册校验规则回调
  const registerRules = (name: string, rules: Rules) => {
    formRulesRef.current[name] = rules;
  };
  // 注册单个字段校验回调
  const validateField: <T>(name: string, value: T) => string | undefined = (
    name,
    value
  ) => {
    const rules = formRulesRef.current[name];
    if (!rules) return;
    let errorMessage: string | undefined;
    const hasError = rules.some((rule) => {
      if (rule.required && (!value || value === "")) {
        errorMessage = rule.message || "该项为必填项";
        return true;
      }
      if (rule.validator) {
        const error = rule.validator(value);
        if (error) {
          errorMessage = error;
          return true;
        }
      }
      return false;
    });
    return hasError ? errorMessage : undefined;
  };
  // 更新表单字段值回调
  const setFieldsValue = (fieldsValue: Record<string, any>) => {
    formValuesRef.current = {
      ...formValuesRef.current,
      ...fieldsValue,
    };

    // 更新UI
    if (updateRef.current) {
      updateRef.current();
    }
  };

  // 注册所有字段校验回调
  const validate: () => boolean = () => {
    const newErrors: Record<string, string> = {};
    const values = formValuesRef.current;
    const rules = formRulesRef.current;
    Object.keys(rules).forEach((name) => {
      // 遍历校验字段
      const error = validateField(name, values[name]);

      if (error) {
        newErrors[name] = error;
      }
    });
    // 记录错误信息
    errorsRef.current = newErrors;
    // 通知ui更新
    updateRef.current?.();

    return Object.keys(newErrors).length === 0;
  };

  // 注册提交表单回调
  const onSubmit = (onFinish: (values: Record<string, any>) => void) => {
    // 先校验表单
    if (validate()) {
      onFinish(formValuesRef.current);
    } else {
      console.log("校验失败");
    }
  };
  const formInstance = {
    registerUpdate,
    registerRules,
    setFieldsValue,
    onSubmit,
    validate,
    // 用 getter 动态获取最新值
    get errors() {
      return errorsRef.current;
    },
    get values() {
      return formValuesRef.current;
    },
  };
  // 暴露接口
  return [formInstance];
}

export default useForm;
