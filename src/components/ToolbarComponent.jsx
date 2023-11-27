import React from 'react'
import { Typography, IconButton, Stack, Avatar, Menu, MenuItem } from '@mui/material'
import logo from '../assets/icon-dci.png'
import { useSelector } from 'react-redux'
function ToolbarComponent() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const reducer = useSelector(state => state.reducer);
    return (
        <div className="bg-[#fff] h-[7.5%] flex items-center pl-[16px] font-semibold text-[2em] text-white justify-between appbar">
            <div>
                <Stack direction={'row'} gap={1} alignItems={'center'}>
                    <img src={logo} className="w-[35px] h-[35px]" />
                    <span className="text-black">DCI Sale Forecase Month</span>
                </Stack>
            </div>
            <div>
                <Stack direction={'row'} alignItems={'center'} spacing={0} onClick={() => setAnchorEl(true)} className="cursor-pointer">
                    <Typography className="text-black">{reducer.name}</Typography>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        onClick={handleClick}
                        sx={{ ml: 2 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        color="inherit"
                    >
                        <Avatar src={`http://dcihrm.dci.daikin.co.jp/PICTURE/${reducer.empcode}.JPG`}> </Avatar>
                    </IconButton>
                </Stack>
            </div>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
            >
                <MenuItem onClick={() => {
                    handleLogout()
                    setOpenAppmenu(false)
                }}>ออกจากระบบ</MenuItem>
            </Menu>
        </div>
    )
}

export default ToolbarComponent