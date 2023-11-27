import React from 'react'
import { Stack } from '@mui/material'
function FooterComponent(props) {
    const { data } = props;
    return (
        <Stack>
            <div className="h-[4.5%] pl-3 flex items-center">
                จำนวนแถวทั้งหมด : {typeof data?.length != 'undefined' ? data?.length : 0}
            </div>
        </Stack>
    )
}

export default FooterComponent