import React, { useState, useRef } from "react";
import { searchStatus } from "../constants";
import { Select, Button, Spin } from "antd";
import SearchDefault from "../searchDefault/index";
import useRemoteSearch from "./hooks/useRemoteSearch";
import type { SelectGroupProps } from "./type";
const SelectMultiple = ({
  placeholder,
  onChange,
  mode,
  en,
  data,
  remoteSearchConfiguration,
  ...rest
}: any) => {
  const [open, setOpen] = useState<boolean>(true); // 是否展开下拉框
  const searchParamsRef = useRef<
    | {
        searchLabel: { en: string | any[] };
        searchEn: string;
        searchVal: string | any[];
      }
    | undefined
  >(undefined);
  
  const { handleSearch, fetchLoading, remoteOptions } =  useRemoteSearch(
    remoteSearchConfiguration?.fetchData,
    remoteSearchConfiguration?.debounceTime,
    remoteSearchConfiguration?.resParams
  );

  // 是否使用远程搜索结果
  // 确定使用远程数据还是本地数据
  const selectOptions = remoteSearchConfiguration?.remote
    ? remoteOptions
    : data;
  const handleOnchange = (val: string | any[]) => {
    // 判断val是否多选，多选的话，全部选择完毕，再传递数据
    if (!Array.isArray(val) && mode !== "multiple") {
      setOpen(false);
      onChange({ [en]: val }, en, val);
    } else if (Array.isArray(val) && mode === "multiple") {
      // 多选 && 全部选择完毕，再传递数据
      searchParamsRef.current = {
        searchLabel: { en: val },
        searchEn: en,
        searchVal: val,
      };
    }
  };
  return (
    <Select
      style={{ minWidth: "200px" }}
      open={open}
      mode={mode}
      autoFocus
      onChange={(val) => {
        handleOnchange(val);
      }}
      placeholder={placeholder}
      getPopupContainer={(triggerNode) => triggerNode.parentElement}
      options={selectOptions}
      showSearch={remoteSearchConfiguration?.remote}
      filterOption={!remoteSearchConfiguration?.remote} // 本地搜索才使用内置过滤
      onSearch={remoteSearchConfiguration?.remote ? handleSearch : undefined} // 远程搜索触发
      notFoundContent={fetchLoading ? <Spin size="small" /> : "NOT FOUND DATA"}
      popupRender={(menu) => (
        <div className="popupBox">
          {mode === "multiple" && (
            <Spin
              spinning={fetchLoading}
              size="small"
              wrapperClassName="spinning"
            />
          )}
          {!fetchLoading && menu}
          {/* 可以添加自定义底部 */}
          {mode === "multiple" && !fetchLoading && remoteOptions.length > 0 && (
            <div className="footer">
              <Button
                type="link"
                size="small"
                onClick={() => {
                  searchParamsRef.current = undefined;
                  setOpen(false);
                  onChange({ [en]: undefined }, en, undefined);
                }}
              >
                取消
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  setOpen(false);
                  onChange(
                    searchParamsRef.current?.searchLabel,
                    searchParamsRef.current?.searchEn,
                    searchParamsRef.current?.searchVal
                  );
                }}
              >
                确定
              </Button>
            </div>
          )}
        </div>
      )}
      {...rest}
    />
  );
};

const SelectGroup = ({
  en,
  placeholder,
  icon,
  mode,
  data,
  className,
  remoteSearchConfiguration,
  onChange,
  ...rest
}: SelectGroupProps) => {
  const [status, setStatus] = useState<number>(searchStatus?.defaultStatus);
  const handleOnchange = (
    searchLabel: { en: string | any[] },
    searchEn: string,
    searchVal: string | any[]
  ) => {
    setStatus(searchStatus?.defaultStatus);
    onChange?.(searchLabel, searchEn, searchVal);
  };
  return (
    <div
      className={`${className} selectGroup`}
      onBlur={() => {
        if (status === searchStatus?.searching) {
          setStatus(searchStatus?.defaultStatus);
        }
      }}
      // 关键：点击内部元素时，阻止 div 失焦
      onMouseDown={(e) => e.preventDefault()}
    >
      {status === searchStatus?.defaultStatus ? (
        <SearchDefault
          placeholder={placeholder}
          icon={icon}
          onClick={() => {
            setStatus(searchStatus?.searching);
          }}
        />
      ) : (
        <SelectMultiple
          en={en}
          mode={mode}
          data={data}
          placeholder={placeholder}
          onChange={handleOnchange}
          remoteSearchConfiguration={remoteSearchConfiguration}
          {...rest}
        />
      )}
    </div>
  );
};

export default SelectGroup;
