// 搜索默认状态
import React from "react";
import { Tooltip } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { ReactNode } from "react";
import { validValue } from "../utils/index";
export interface searchDefaultProps {
  icon?: ReactNode;
  placeholder: string;
  value?: string;
  tipOption?: object;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const SearchDefault = ({
  icon,
  value,
  placeholder,
  tipOption,
  className,
  onClick,
}: searchDefaultProps) => {
  return (
    <div onClick={onClick}>
      <Tooltip {...tipOption} className={`${className} searchDefault`}>
        {icon ? icon : <SearchOutlined className="f14 grey" />}
        <span className="ml6 f14 grey">
          {validValue(value) ? value : placeholder}{" "}
        </span>
      </Tooltip>
    </div>
  );
};

export default SearchDefault;
