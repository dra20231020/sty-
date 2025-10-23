export interface SelectListProps {
  label: string; // 选项的显示文本
  value: any[] | string; // 选项的值
  disabled?: boolean; // 是否禁用该选项
}
export interface RemoteSearchRes {
    label?: string,
    value?: string | number,
    [key: string]: any; // 其他属性
}
export interface SelectGroupProps {
  en?: string; // 唯一标识符，用于传递数据给父组件
  placeholder: string; // 占位符文本
  icon?: React.ReactNode; // 图标
  data?: SelectListProps[]; // options 数据
  mode?: "multiple" | "tags"; // 选择模式，默认为单选
  onChange?: (
    searchLabel: { en: string | any[] } | undefined,
    searchEn: string | undefined,
    searchVal: string | any[] | undefined
  ) => void; // 选项改变时的回调函数
  [key: string]: any;
  remoteSearchConfiguration?: {
    resParams?: {
      label: string;
      value: string;
      disabled?: string; // 禁用字段. 1为禁用，2为不禁用
    };
    fetchData?: (val?: string) => Promise<RemoteSearchRes[]>; // 多选远程搜索请求方法
    remote?: boolean; // 是否开启远程搜索
    debounceTime?: number; // 防抖时间
  };
}

export enum btnStatus {
   disabled = "1",
   available= "2",
}
