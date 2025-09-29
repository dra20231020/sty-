import React, { useMemo } from "react";
import "../style";
import RebateCard from "../index";

interface CorporateData {
  key: string;
  title: string;
  orderNum: number;
  price: number;
  headerTipText: string;
  isContentShowTip?: boolean;
  receiveStatusList: number[];
}
interface CorporateParams {
  publicTotalReceive: CorporateData;
  publicTotalRecycled: CorporateData;
}
const PIC_1 =
  "https://ruhnn-web.oss-cn-hangzhou.aliyuncs.com/koc/org/MediumPlatform1.png";

export default () => {
  const { corporateParams } = useMemo(
    () => ({
      corporateParams: {
        publicTotalReceive: {
          key: "publicTotalReceive",
          title: "总计发起-应收",
          orderNum: 11,
          price: 22,
          headerTipText: "报备单完结的 t+1 即计入应收",
          isContentShowTip: false,
          // signStatusList: [],
          receiveStatusList: [11, 12, 13],
          imgSrc: PIC_1,
        },
        publicTotalRecycled: {
          key: "publicTotalRecycled",
          title: "已回收",
          orderNum: 33,
          price: 44,
          headerTipText: "报备单完结的 t+1 且合同全部已收款",
          // signStatusList: [],
          receiveStatusList: [13],
          imgSrc: PIC_1,
        },
      } as CorporateParams,
    }),
    []
  );

  const jumpDetail = (...rest: any[]) => {
    // 添加一个空的跳转函数，避免 onclick 报错
    console.log(`跳转详情：${rest}`);
    
  };

  return (
    <div className="body">
      {Object.keys(corporateParams).map((item) => (
        <RebateCard
          key={corporateParams[item as keyof CorporateParams]?.key}
          type={1}
          data={corporateParams[item as keyof CorporateParams]}
          isHeaderShowTip
          placement="top"
          onclick={jumpDetail}
          className="corporate"
          //   headerRihgtImgSrc={PRIVATE_1}
        />
      ))}
    </div>
  );
};
