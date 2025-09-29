import React from "react";
import SelectMultiple from "../../select/index";
import type { RemoteSearchRes } from "../type";
import "../style/index";
import "../../searchDefault/style/index";
export default () => {
  const handleSearch = (
    searchLabel: { en: string | any[] } | undefined,
    searchEn: string | undefined,
    searchVal: string | any[] | undefined
  ) => {
    console.log(searchLabel, searchEn, searchVal, "父组件接受的数据");
  };
  const fetchData = () => {
    return new Promise<RemoteSearchRes[]>((resolve) => {
      setTimeout(() => {
        resolve([
          {
            value: "1",
            name: "Jack",
            disabled: "1",
          },
          {
            value: "2",
            name: "Lucy",
            disabled: "2",
          },
          {
            value: "3",
            name: "huang",
            disabled: "2",

          },
        ]);
      }, 1000);
    });
  };
   
  return (
    <div style={{display:'flex',columnGap:'50px'}} >
     <SelectMultiple
      en="contractNo"
      size="large" 
      placeholder="单选"
      onChange={handleSearch}
      data={[
        {
          value: "jack",
          label: "Jack",
        },
        {
          value: "lucy",
          label: "Lucy",
        },
        {
          value: "disabled",
          disabled: true,
          label: "Disabled",
        },
      ]}
    />
     <SelectMultiple
      en="contractNo"
      size="large" 
      placeholder="多选"
      mode="multiple"
      onChange={handleSearch}
      data={[
        {
          value: "jack",
          label: "Jack",
        },
        {
          value: "lucy",
          label: "Lucy",
        },
        {
          value: "disabled",
          disabled: true,
          label: "Disabled",
        },
      ]}
      remoteSearchConfiguration={{
        fetchData: fetchData,
        remote: true,
        debounceTime: 300,
        resParams: {
          label: "name",
          value: "value",
          disabled: "disabled",
        },
      }}
    />
    </div>
   
  );
};
