import { useState, useRef, useEffect, useCallback } from "react";
import { validValue } from "../../utils";
import { message } from "antd";
import type { RemoteSearchRes } from "../type";
import { btnStatus } from "../type";
// 自定义hooks，支持多选远程搜索，防抖控制，请求时序控制，加载控制等

const useRemoteSearch = (
  fetchData: (val?: string) => Promise<RemoteSearchRes[]>,
  debounceTime: number = 0,
  resParams: {
    label: string;
    value: string;
    disabled: string;
  } = {
    label: "label",
    value: "value",
    disabled: "disabled",
  }
) => {
  const [searchValue, setSearchValue] = useState<string>(""); // 搜索值
  const [remoteOptions, setRemoteOptions] = useState<RemoteSearchRes[]>([]); // 远程搜索结果
  const [fetchLoading, setFetchLoading] = useState<boolean>(false); // 加载状态
  const timerId = useRef<ReturnType<typeof setTimeout> | undefined>(undefined); // 防抖定时器
  const currentFetchId = useRef<number>(0); // 当前请求的ID
  const hasActiveRequest = useRef(false);   // 新增：标记当前是否有活跃请求
  // 初始化展示数据
  const initialOptions = useCallback(() => {
    if (hasActiveRequest.current || !fetchData) return;
    hasActiveRequest.current = true;
    setFetchLoading(true);
    fetchData()
      .then((res) => {
        setRemoteOptions(
          res.map((item) => ({
            label: item[resParams?.label],
            value: item[resParams?.value],
            disabled:
              item[resParams?.disabled] === btnStatus.disabled ? true : false,
          }))
        );
      })
      .catch((err) => {
        message.error(`初始化请求下拉框数据失败:${err}`);
      })
      .finally(() => {
        hasActiveRequest.current = false;
        setFetchLoading(false);
      });
  }, [fetchData, resParams]);
  // 清理副作用
  useEffect(() => {
    initialOptions();
    return () => {
      if (timerId.current) {
        clearTimeout(timerId.current);
      }
    };
  }, [initialOptions]);
  // 空函数，调用无副作用
  if (!fetchData) {
    return {
      handleSearch: () => {}, 
      fetchLoading: false,
      remoteOptions: [],
    };
  }
  // 防抖处理
  const debounceFn = (fn: () => any, delay: number) => {
    if (timerId.current) {
      clearTimeout(timerId.current);
    }
    timerId.current = setTimeout(() => {
      fn();
    }, delay);
  };
  // 过滤展示数据
  const filterOptions = (val: string, options: RemoteSearchRes[]) => {
    if (!validValue(val)) return [];
    const res = options
      .map((item) => ({
        label: item[resParams?.label],
        value: item[resParams?.value],
        disabled:
          item[resParams?.disabled] === btnStatus.disabled ? true : false,
      }))
      .filter((item) => item.label?.includes(val));
    return res;
  };

  // 搜索处理函数
  const handleSearch = (val: string) => {
    setSearchValue(val);
    // setRemoteOptions([]);
    if (!validValue(val)) {
      // 关键：输入为空时，清除防抖定时器，阻止旧任务执行
      if (timerId.current) {
        clearTimeout(timerId.current);
        timerId.current = undefined;
      }
      // 关键：输入为空时，重新初始化展示数据
      initialOptions();
      return;
    }
    currentFetchId.current += 1;
    const fetchId = currentFetchId.current; // 当前请求的ID
    // 防抖处理
    debounceFn(() => {
      hasActiveRequest.current = true;
      setFetchLoading(true);
      fetchData(val)
        .then((res) => {
          if (Array.isArray(res) && res.length > 0) {
            // 远程搜索结果，暴露给父组件，父组件可以自定义渲染逻辑
            if (fetchId === currentFetchId.current) {
              // 保证当前请求的ID与最后一次请求的ID相同，才更新远程搜索结果
              // 过滤展示数据，只显示包含搜索值的选项
              setRemoteOptions(filterOptions(val, res));
            }
          }
        })
        .catch((err) => {
          message.error(`获取远程数据失败: ${err}`);
        })
        .finally(() => {
          hasActiveRequest.current = false;
          setFetchLoading(false);
        });
    }, debounceTime);
  };

  // 暴露给父组件的状态
  return {
    searchValue,
    remoteOptions,
    fetchLoading,
    handleSearch,
  };
};

export default useRemoteSearch;
