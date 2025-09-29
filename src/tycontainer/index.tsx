import React, { useState, useEffect, useMemo, useCallback } from "react";
import Header from "./components/Header";


export interface TyContainerProps {
    style?: React.CSSProperties;
    headStyle?: React.CSSProperties;
    contentStyle?: React.CSSProperties;
    renderType?: string;
    showCloseIcon?: boolean;
    headerLeft?: any;
    headerRight?: any;
    content?: any;
    className?: string;
    breadCrumb?: any;
    onClose?: () => void;
}

const TyContainer: React.FC<TyContainerProps> = (

    {
        style, // 覆盖外层容器样式
        headStyle,//覆盖头部容器样式
        contentStyle, //覆盖内容区样式
        renderType, //控制渲染类型  model为弹窗，其余为页面
        showCloseIcon, // 弹窗显示关闭按钮  
        headerLeft,  // 头部左侧内容
        headerRight, // 头部右侧内容
        content,//内容区
        className, // 覆盖元素样式
        breadCrumb, // 面包屑  
        onClose // 关闭弹窗回调函数 
    }
) => {

    const [outSideOpen, setOutSideOpen] = useState(false) // 动态给外部容器添加样式
    const [contentOpen, setContentOpen] = useState(false) // 动态给内容区添加样式
    // 初始化样式添加动画效果
    useEffect(() => {
        setOutSideOpen(true)
        setTimeout(() => {
            setContentOpen(true)
        }, 100)
    }, [])
    const isModel = renderType === 'model'
    const runAddOutsideClass = useMemo(() => {
        return (
            [
                'commonContainer',
                outSideOpen ? 'commonContainer-open' : '',
                (isModel && !outSideOpen) ? 'commonContainer-event-none' : ''
            ].filter(Boolean).join(' ')
        )
    }, [outSideOpen,contentOpen,isModel])
    const runAddContentClass = useMemo(() => {
        return (
            [
                'commonContainer-body',
                contentOpen ? 'commonContainer-body-open' : '',
                (isModel && !contentOpen) ? 'commonContainer-body-event-none' : ''
            ].filter(Boolean).join(' ')
        )
    }, [outSideOpen,contentOpen,isModel])
    const handleModalClose = useCallback(
        () => {
            setContentOpen(false)
            setTimeout(() => {
                setOutSideOpen(false)
                if (onClose) {
                    onClose()
                }
            },
                isModel ? 400 : 0 // 弹窗关闭动画时长为400ms
            )
        }, [onClose, isModel]
    )
    // 浏览器历史记录默认后退
    const handleBack = () => {
        window.history.back();
    }
    return (
        <div className={runAddOutsideClass} >
            <div className={runAddContentClass} style={style}>
                {breadCrumb}
                <div className='commonContainer-body-header' style={headStyle}>
                {(headerLeft || headerRight) ? <Header
                    headerLeft={headerLeft}
                    headerRight={headerRight}
                    showCloseIcon={isModel ? showCloseIcon : false}
                    onHeaderCloseIconClick={isModel ? handleModalClose : handleBack}
                /> : null}
                </div>
                <div className={`commonContainer-body-content  ${className}`} style={contentStyle}>
                    {content}
                </div>
            </div>
        </div>
    )
}


export default TyContainer;