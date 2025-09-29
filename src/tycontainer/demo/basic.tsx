import React from "react";
import '../style'
import TyContainer from '../index'
export default () => (
    <TyContainer
        renderType="page"
        showCloseIcon={true}
        headerLeft={<div>达人通知数据</div>}
        headerRight={() => (<div>右侧按钮</div>)}
        content={<div>内容区</div>}
        className="content-class"
    />
)

