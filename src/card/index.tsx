import React from "react";
import { ExclamationCircleOutlined, RightOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

export interface RebateCardProps {
  type?: number;
  onclick?: (
    type: string,
    accountStartDay: string,
    accountEndDay: string,
    signStatusList: number[],
    receiveStatusList: number[]
  ) => void;
  isHeaderShowTip?: boolean;
  headerTipIcon?: React.ReactNode;
  data?: any;
  placement?:
    | "top"
    | "left"
    | "right"
    | "bottom"
    | "topLeft"
    | "topRight"
    | "bottomLeft"
    | "bottomRight"
    | "leftTop"
    | "leftBottom"
    | "rightTop"
    | "rightBottom";
  headerRihgtImgSrc?: string;
  className?: string;
  tipOption?: object;
}

const RebateCard = ({
  type,
  onclick,
  isHeaderShowTip = false,
  headerTipIcon,
  placement = "top",
  headerRihgtImgSrc,
  data,
  className,
  tipOption,
}: RebateCardProps) => (
  <div
    className={`card ${className}`}
    onClick={() => {
      // 准备参数传递
      onclick?.(
        `${type}`,
        data?.accountStartDay,
        data?.accountEndDay,
        data?.signStatusList,
        data?.receiveStatusList
      );
    }}
  >
    <div className={`header`}>
      <div>
        <span>{data?.title}</span>
        {isHeaderShowTip && (
          <Tooltip
            title={data?.headerTipText}
            placement={placement}
            {...tipOption}
          >
            {headerTipIcon || <ExclamationCircleOutlined className="ml6 f12" />}
          </Tooltip>
        )}
      </div>
      {headerRihgtImgSrc ? (
        <img alt="" src={headerRihgtImgSrc} />
      ) : (
        <RightOutlined className="w1" />
      )}
    </div>
    <div className={`content`}>
      <div className={`left`}>
        <div className={`money`}>
          <span className={`le`}>¥</span>
          <span>{data?.price || "-"}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span className={`num`}>
            单量：
            {data?.orderNum || "-"}
          </span>
          {data?.isContentShowTip && (
            <Tooltip
              title={data?.contentTipText}
              placement={placement}
              {...tipOption}
            >
              {data?.contentTipIcon || (
                <ExclamationCircleOutlined className="ml6 f12" />
              )}
            </Tooltip>
          )}
        </div>
      </div>
      <div className={`right`}>
        <img alt="" src={data?.imgSrc} />
      </div>
    </div>
  </div>
);

export default RebateCard;
