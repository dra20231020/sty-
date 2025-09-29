import React, { ReactNode, useMemo } from 'react';
import { CloseOutlined } from '@ant-design/icons';

interface HeaderProps {
    headerLeft?: ReactNode
    headerRight?: ((buttons: { headerCloseIcon: ReactNode }) => ReactNode) | null
    showCloseIcon?: boolean
    onHeaderCloseIconClick?: (() => void) | undefined
}
const Header: React.FC<HeaderProps> = ({
    headerLeft = null,
    headerRight = null,
    showCloseIcon = false,
    onHeaderCloseIconClick = undefined,
}) => {

    const headerCloseIcon = useMemo(() => (
        <CloseOutlined className='commonContainer-body-header-closeIcon' onClick={onHeaderCloseIconClick} />
    ), [])
    // 后续会有新增的icon或者按钮都集成buttons对象中，此处先预留出来
    const buttons = useMemo(() => (
        {
            headerCloseIcon
        }
    ), [])
    const rightDom = useMemo(() => {
        if (headerRight) {
            return (
                <>
                    {
                        ((typeof headerRight === 'function') ?
                            (headerRight as (buttons: { headerCloseIcon: ReactNode }) => ReactNode)(
                                {
                                    ...buttons
                                }
                            ) : null)
                    }
                    {
                        (showCloseIcon ? buttons.headerCloseIcon : null)
                    }
                </>
            )
        }

        return showCloseIcon ? buttons.headerCloseIcon : null
    }, [headerRight, buttons])
    return (
        <>
            <div className='commonContainer-body-header-left'>
                {headerLeft}
            </div>
            <div className='commonContainer-body-header-right'>
                {rightDom}
            </div>
        </>
    )
}



export default Header