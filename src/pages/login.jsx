import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { useState } from 'react'
import logo from './../images/icon-dci.png'
import axios from 'axios';
import { Backdrop, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Daikin Compressor Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}


const defaultTheme = createTheme();

export default function Login() {
    const dispatch = useDispatch();
    const reducer = useSelector((state) => state.reducer);
    const [userReq, setUseReq] = useState(false);
    const [pwdReq, setPwdReq] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false)
    const [showLoginFalse, setShowLoginFalse] = useState(false)
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        var pwd = data.get('password').toString();
        var req = 0;
        if (data.get('email')?.toString().length == 0) {
            setUseReq(true)
            req = 1;
        }
        if (pwd.length == 0) {
            setPwdReq(true)
            req = 1;
        }
        if (req == 0) {
            try {
                setOpenBackdrop(true);
                setUseReq(false);
                setPwdReq(false);
                axios.get('http://websrv01.dci.daikin.co.jp/BudgetCharts/BudgetRestService/api/authen?username=' + data.get('email') + '&password=' + encodeURIComponent(pwd)).then((res) => {
                    if (res.data[0]?.FullName != null) {
                        dispatch({ type: 'LOGIN', payload: { login: true, name: res.data[0]?.FullName, empcode: res.data[0].EmpCode } });
                        setShowLoginFalse(false)
                    } else {
                        setShowLoginFalse(true)
                        setOpenBackdrop(false);
                    }
                }).catch((error) => {
                    console.log(error)
                    alert('ไม่สามารถเข้าสู่ระบบได้ เนื่องจาก ' + error.message)
                    setShowLoginFalse(true)
                })
            } catch (error) {
                alert('ไม่สามารถเข้าสู่ระบบได้ เนื่องจาก ' + error.message)
                setShowLoginFalse(true)
                setOpenBackdrop(false);
            }
        }
    };
    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="sm" className='flex flex-col'>
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar className='mb-2' sx={{ m: 0, }} src={logo} variant="rounded" >
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sale Forcase System
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            fullWidth
                            size='small'
                            id="email"
                            label="รหัสเข้าเครื่อง หรือ รหัสพนักงาน"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            error={userReq}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            size='small'
                            name="password"
                            label="รหัสผ่าน หรือ รหัสพนักงาน"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            error={pwdReq}
                        />
                        {
                            showLoginFalse && <Typography className='text-red-500'>* รหัสผ่านไม่ถูกต้อง</Typography>
                        }
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    ลืมรหัสผ่าน?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2">
                                    {"ไม่มีสมาชิก? สมัครสมาชิก"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </ThemeProvider>
    );
}