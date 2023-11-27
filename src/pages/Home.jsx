import React from 'react'
import { Grid, Stack, Typography, Card, Button, Menu, MenuItem } from '@mui/material'
import moment from 'moment'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { API_GET_DISTRIBUTION } from '../Service'
function Home() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event, numMonth) => {
        setMonth(numMonth)
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [year, setYear] = useState(2023);
    const [month, setMonth] = useState(0);

    useEffect(()=>{
        init();
    },[])
    async function init(){
        const res = await API_GET_DISTRIBUTION();
        console.log(res);
    }
    return (
        <Stack>
            <Typography>ปี 2023</Typography>
            <Grid container p={3} alignItems={'center'}>
                {
                    [...Array(12)].map((index, numMonth) => {
                        let monthName = moment().month(numMonth).format('MMM');
                        return <Grid key={index} item xs={3} className='cursor-pointer'>
                            <Card>
                                <Stack className='h-full' justifyContent={'center'} alignItems={'center'}>
                                    <Typography color="initial"> {monthName}</Typography>
                                    <Typography>ฉบับปรับปรุง</Typography>
                                    <Button
                                        id="basic-button"
                                        aria-controls={open ? 'basic-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                        onClick={(e) => handleClick(e, numMonth + 1)}
                                    >
                                        #
                                    </Button>
                                </Stack>
                            </Card>
                        </Grid>
                    })
                }
            </Grid>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={
                    () => {
                        dispatch({
                            type: 'SET_EDIT', payload: {
                                year: year,
                                month: month
                            }
                        })
                        navigate('./edit');
                        handleClose()
                    }
                }>แก้ไข</MenuItem>
            </Menu>
        </Stack>
    )
}

export default Home