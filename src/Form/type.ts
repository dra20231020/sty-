export interface Rule {
  required?: boolean;
  message?: string;
  validator?: (value: any) => string | undefined;
}
// 字段值类型
export type Values = Record<string, any>;
export type Rules = Rule[];
// 错误信息映射
type Errors = Record<string, string>;
// 表单实例接口
export interface FormInstance {
  values: Values;
  errors: Errors;
  registerUpdate: (updateFn: () => void) => void;
  setFieldsValue: (newValues: Partial<Values>) => void;
  validate: () => boolean; // 返回是否校验通过
  onSubmit: (onFinish: (values: Values) => void) => void;
  registerRules: (name: string, rules: Rule[]) => void;
}
