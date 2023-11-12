import { Box, Grid, Backdrop, Stack, Snackbar, TableContainer, TextField, Avatar, Typography, Button, Alert, Paper, Select, Menu, MenuItem, Table, TableHead, TableRow, TableCell, TableBody, IconButton, InputBase, CircularProgress, Divider, List, SpeedDial } from "@mui/material";
import { useEffect, useState } from "react";
import { API_DELETE_ALL_DATA, ServiceGetCustomers, ServiceGetModels, ServiceGetPltype, ServiceGetSaleForecase, ServiceGetUser, ServiceSaveSaleForcase } from "../Service";
import moment from "moment";
import parse from "paste-from-excel";
import SaveIcon from '@mui/icons-material/Save';
// import { useStyles } from "../styled";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import logo from '../assets/icon-dci.png'
import FilterListIcon from '@mui/icons-material/FilterList';
import React from "react";
function SealForecase() {

    // customer name , model name,sebango,pltype
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const reducer = useSelector(state => state.reducer);
    const dispatch = useDispatch();
    const empcode = reducer?.empcode;
    const [loading, setLoading] = useState(true);
    const startDate = moment().format('YYYY-MM-01').toString();
    const endDate = moment(moment().format('YYYY-MM-01').toString()).add(31, 'day').format('YYYY-MM-DD').toString();
    const [days, setDays] = useState([]);
    const [countRow, setCountRow] = useState(10);
    const [newRow, setNewRow] = useState(10);
    const [inputvalue, setinputvalue] = useState({});
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const [monthSelected, setMonthSelected] = useState(moment().format('MM'));
    const [yearSelected, setYearSelected] = useState(moment().format('YYYY'));
    const yearNow = moment().format('YYYY');
    const [openMsg, setOpenMsg] = useState(0);
    const [message, setMessage] = useState('ทดสอบระบบ');
    const [openAppMenu, setOpenAppmenu] = useState(false);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [openSnackBarFalse, setOpenSnackBarFalse] = useState(false);

    const [model, setmodel] = useState([]);
    const [customer, setcustomer] = useState([]);
    const [pltype, setpltype] = useState([]);
    // const [loading, setLoading] = useState(true);
    const handlePaste = (index, elm, e, i) => {
        return parse(e);
    };

    const handleLogout = () => {
        if (confirm('คุณต้องการออกจากระบบใช่หรือไม่ ?')) {
            dispatch({ type: 'LOGIN', payload: { login: false } })
        }
    }

    const handlePaste1 = (index, elm, e, i) => {
        setinputvalue((inputvalue) => ({
            ...inputvalue,
            inputs: inputvalue.inputs.map((item, i) =>
                index === i
                    ? {
                        ...item,
                        [elm]: (elm != 'modelCode' && elm != 'pltype' && elm != 'customer' && elm != 'sebango') ? (e.target.value != '' ? parseInt(e.target.value) : '') : (elm == 'customer' ? e.target.value.toUpperCase() : e.target.value)
                    }
                    : item
            )
        }));
    };

    async function init() {
        setLoading(true);
        await initialContent();
        const resModel = await ServiceGetModels();
        const resCustomer = await ServiceGetCustomers();
        const resPltype = await ServiceGetPltype();
        setcustomer(resCustomer);
        setmodel(resModel);
        setpltype(resPltype);
        setLoading(false);
    }

    async function handleDeleteAll() {
        if (confirm('คุณต้องการลบรายการทั้งหมด ใช่หรือไม่')) {
            var data = inputvalue.inputs;
            data.map((item, index) => {
                Object.keys(item).map((el, ind) => {
                    data[index][el] = "";
                })
            })
            const delAll = await API_DELETE_ALL_DATA({ ym: `${yearSelected}${monthSelected.toLocaleString('en', { minimumIntegerDigits: 2 })}` });
            console.log(delAll)
            setinputvalue({ ...inputvalue, inputs: [...data] })
        }
    }
    const initialContent = async () => {
        const saleforecase = await ServiceGetSaleForecase(`${yearSelected}${monthSelected.toLocaleString('en', {
            minimumIntegerDigits: 2,
            useGrouping: false
        })}`);
        setDays([]);
        var initDays = [];
        var i = 0;
        var input = { inputs: [] };
        while (i < (saleforecase.length < countRow ? countRow : saleforecase.length)) {
            var colInput = {};
            var a = moment(startDate);
            var b = moment(endDate);
            initDays = []
            initDays.push('customer');
            initDays.push('modelCode');
            initDays.push('sebango')
            initDays.push('pltype');
            for (var m = moment(a); m.isBefore(b); m.add(1, 'days')) {
                initDays.push('d' + m.format('DD'));
            }
            if (typeof saleforecase[i] !== 'undefined') {
                colInput = saleforecase[i];
            } else {

                if (typeof inputvalue.inputs != 'undefined' && i < inputvalue.inputs.length) {
                    colInput = inputvalue.inputs[i]
                }
            }
            input.inputs.push(colInput)
            i++;
        }
        setinputvalue({ ...input })
        setDays([...initDays]);
    }

    const handleCheck = (obj, key, val) => {
        return (typeof val == 'undefined' || val == '' || obj.findIndex(el => el[key] == val) == -1) ? 1 : 0;
    }

    const handleCheckSebango = (obj, key, val, modelCode) => {
        let index = obj.findIndex(el => el[key] == val);
        let sebango = '';
        let err = 0;
        if (modelCode != 'undefined' && modelCode != '') {
            index = obj.findIndex(el => el['model'] == modelCode);
            if (index != -1) {
                sebango = model[index].modelCode;
            } else {
                err = 1;
            }
        } else {
            sebango = "-";
            err = 1;
        }
        return {
            error: err,
            sebango: sebango
        };
    }

    const handleSave = async () => {
        var data = []
        var empty = [];
        var checkPltype = true;
        setLoading(true);
        inputvalue.inputs.map((item, index) => {
            var row = inputvalue.inputs[index];
            var errors = [];
            let checkSebango = handleCheckSebango(model, 'modelCode', row['sebango'], row['modelCode']);
            errors['customer'] = handleCheck(customer, 'customerNameShort', row['customer']);
            errors['modelCode'] = handleCheck(model, 'model', row['modelCode']);
            errors['pltype'] = handleCheck(pltype, 'pltype', row['pltype']);
            errors['sebango'] = checkSebango.error;
            inputvalue.inputs[index]['id'] = 0;
            if (typeof inputvalue.inputs[index]['modelCode'] != 'undefined' && inputvalue.inputs[index]['modelCode'] != '') {
                if (inputvalue.inputs[index]['pltype'] == '' || typeof inputvalue.inputs[index]['pltype'] == 'undefined') {
                    setMessage('กรุณากรอกข้อมูล PLTYPE ')
                    setOpenMsg(1);
                    inputvalue.inputs[index]['warning'] = 1;
                    checkPltype = false;
                }
                inputvalue.inputs[index]['sebango'] = checkSebango.sebango;
                inputvalue.inputs[index]['modelCode'] = inputvalue.inputs[index]['modelCode'];
                inputvalue.inputs[index]['modelName'] = inputvalue.inputs[index]['modelCode'];
                inputvalue.inputs[index]['ym'] = yearSelected + '' + monthSelected;
                inputvalue.inputs[index]['ym'] = `${yearSelected}${monthSelected.toLocaleString('en', { minimumIntegerDigits: 2, useGrouping: false })}`;
                inputvalue.inputs[index]['lrev'] = '999';
                inputvalue.inputs[index]['createBy'] = empcode.toString();
                inputvalue.inputs[index]['customer'] = inputvalue.inputs[index]['customer'].toString();
                inputvalue.inputs[index]['createDate'] = '2023-10-04T07:53:51.258Z';
                inputvalue.inputs[index]['error'] = errors;
                data.push(inputvalue.inputs[index])
            } else {
                inputvalue.inputs[index]['pltype'] = '';
                inputvalue.inputs[index]['modelCode'] = '';
                inputvalue.inputs[index]['modelName'] = '';
                inputvalue.inputs[index]['ym'] = '';
                inputvalue.inputs[index]['lrev'] = '';
                inputvalue.inputs[index]['createBy'] = '';
                inputvalue.inputs[index]['createDate'] = '';
                inputvalue.inputs[index]['error'] = [];
                Object.keys(inputvalue.inputs[index]).map((key) => {
                    inputvalue.inputs[index][key] = '';
                })
                empty.push(inputvalue.inputs[index])
            }
        });

        var validate = true;
        inputvalue.inputs.map((el, index) => {
            if (Object.values(el.error).includes(1)) {
                validate = false;
            }
        });
        if (validate == false) {
            setMessage('ข้อมูลของคุณยังไม่ถูกต้องตามที่ระบบต้องการ')
            setOpenMsg(1);
            setinputvalue({ ...inputvalue, inputs: [...data] })
            setOpenSnackBarFalse({ ...openSnackBarFalse, msg: 'ข้อมูลของคุณยังไม่ถูกต้องตามที่ระบบต้องการ', status: true })
            setLoading(false);
        } else {
            if (checkPltype != false) {
                var canSave = true;
                var indexRow = 0;
                data.map((item, index) => {
                    var i = 1;
                    var warning = 0;
                    while (i <= 31) {
                        var key = `d` + i.toLocaleString('en', { minimumIntegerDigits: 2, useGrouping: false });
                        item[key] = (item[key] != '' && typeof item[key] !== 'undefined') ? item[key] : 0;
                        if (item[key] > 100000) {
                            warning = 1;
                            canSave = false;
                            setMessage('ระบบไม่รองรับตัวเลขที่มากกว่า 6 ตำแหน่ง')
                            setOpenMsg(1);
                        }
                        i++;
                    }
                    data[index]['row'] = indexRow;
                    data[index]['warning'] = warning;
                    indexRow++;
                })
                if (canSave) {
                    const save = await ServiceSaveSaleForcase({ data: data, ym: `${yearSelected}${monthSelected.toLocaleString('en', { minimumIntegerDigits: 2 })}` }).then((res) => {
                        return res
                    });
                    if (save.status || (save.status == false && data.length == 0)) {
                        setMessage('บันทึกข้อมูลสำเร็จแล้ว ' + moment().format('DD/MM/YYYY HH:mm:ss'))
                        setOpenMsg(2);
                        setinputvalue({ ...inputvalue, inputs: [...data, ...empty] });
                        setOpenSnackBar(true);
                    } else {
                        setMessage('เกิดข้อผิดพลาดกับข้อมูล กรุณาติดต่อ IT (250,611) เบียร์ ' + moment().format('DD/MM/YYYY HH:mm:ss'))
                        setOpenMsg(1);
                        setOpenSnackBarFalse({...openSnackBarFalse,status:true,msg:'เกิดข้อผิดพลาดกับข้อมูล กรุณาติดต่อ IT (250,611) เบียร์'})
                    } 
                    setLoading(false);
                } else {
                    setOpenSnackBar(true);
                    setLoading(false);
                }
            }
        }
    }

    const handleAddRow = () => {
        var count = parseInt(countRow) + parseInt(newRow);
        setCountRow(count);
    }
    const handleDelete = (index) => {
        Object.keys(inputvalue.inputs[index]).map((key) => {
            inputvalue.inputs[index][key] = "";
        })
        setinputvalue({ ...inputvalue, inputs: inputvalue.inputs })
    }
    const handleClear = () => {
        setinputvalue({ ...inputvalue, inputs: [] })
    }
    const checkAlert = (data, index) => {
        return (typeof data != 'undefined' && typeof data[index] != 'undefined' && data[index] == 1) ? 'bg-red-300' : '';
    }
    useEffect(() => {
        init();
    }, [countRow, monthSelected, yearSelected]);
    return (
        <div className="h-full w-full">
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
            </div>
            <div className="h-[88%] p-3 bg-[#dbe2ed]">
                <Paper className="h-[100%]">
                    <Stack direction={'row'} p={2} justifyContent={'space-between'}>
                        <Stack direction={'row'}>
                            <Stack direction={'row'} alignItems={'center'} gap={1}>
                                <FilterListIcon style={{ color: '#65a0f5' }} />
                                <span>Filter Sale</span>
                            </Stack>
                            <div className="flex gap-1 items-center pl-3">
                                <span>Month : </span>
                                <Select size="small" value={monthSelected} onChange={(e) => {
                                    handleClear();
                                    setMonthSelected(e.target.value)
                                }}>
                                    {
                                        monthNames.map((month, index) => (
                                            <MenuItem value={(index + 1)} key={(index + 1)}>{month}</MenuItem>
                                        ))
                                    }
                                </Select>
                                <span>Year : </span>
                                <Select size="small" value={yearSelected} onChange={(e) => {
                                    handleClear();
                                    setYearSelected(e.target.value)
                                }}>
                                    {
                                        [...Array(3)].map((year, index) => {
                                            return <MenuItem value={parseInt(yearNow) + index} key={index}>{parseInt(yearNow) + index}</MenuItem>
                                        })
                                    }
                                </Select>
                            </div>
                        </Stack>
                        <Stack direction={'row'} alignItems={'center'} gap={1}>
                            <TextField type="number" value={newRow} size="small" onChange={(e) => {
                                setNewRow(e.target.value)
                            }} />
                            <Button variant='contained' onClick={() => handleAddRow()} startIcon={<AddCircleIcon />}> เพิ่มแถว </Button>
                            <Button variant='contained' onClick={() => handleSave()} startIcon={<SaveIcon />} color="success"> บันทึก</Button>
                        </Stack>
                    </Stack>
                    <div className="wrapper">
                        {
                            (openMsg == 1 || openMsg == 2) && <div className="pb-2">
                                <Alert severity={`${openMsg == 2 ? 'success' : 'error'}`}>{message}</Alert>
                            </div>
                        }

                        <table>
                            <tr className="text-center ">
                                <th className="w-[40px] sticky top-0 bg-[#28aeed] shadow-md z-50 font-semibold border-black">#</th>
                                {days.map((elm, ind) => {
                                    return (
                                        <th key={ind}
                                            style={{
                                                width: elm == 'modelCode' ? '150px' : (elm == 'customer' ? '80px' : (elm == 'pltype' ? '120px' : '75px'))
                                            }}
                                            className="sticky top-0 bg-[#28aeed] shadow-md z-50 font-semibold border-black"
                                        >
                                            <Typography className="capitalize">{elm}</Typography>
                                        </th>
                                    );
                                })}
                            </tr>
                            {
                                loading ? <tr><td colSpan={days.length + 1}>
                                </td></tr> :
                                    inputvalue?.inputs?.map((res, index) => {
                                        return (
                                            <tr key={index} >
                                                <td className="text-center" >
                                                    <div className="flex p-0 justify-center">
                                                        <IconButton className="p-0 hover:text-red-500" onClick={() => handleDelete(index)}><DeleteIcon /></IconButton>
                                                    </div>
                                                </td>
                                                {days.map((elm, i) => {
                                                    return (
                                                        <td
                                                            className={elm == 'modelCode' && 'sticky'}
                                                            key={i}
                                                            style={{
                                                                minHeight: "30px",
                                                                border: "1px solid black",
                                                                borderRadius: "0px",
                                                                wordWrap: "break-word"
                                                            }}
                                                        >
                                                            <input
                                                                title="saddasd"
                                                                size="small"
                                                                onInput={(e) => {
                                                                    handlePaste1(index, elm, e, i);
                                                                }}
                                                                onPaste={(e) => {
                                                                    handlePaste(index, elm, e, i);
                                                                }}
                                                                type={`${(elm == 'customer' || elm == 'modelCode' || elm == 'pltype' || elm == 'sebango') ? 'text' : 'number'}`}
                                                                value={res[elm]}
                                                                disabled={elm == 'sebango' ? true : false}
                                                                className={`w-full  ${checkAlert(res.error, elm)} ${res?.warning == 1 && 'bg-[#f8717145]'} ${elm == 'sebango' ? 'inpSebango' : ''}`}
                                                            />
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}
                        </table>
                    </div>
                </Paper>
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
                {/* <DialogViewUser open={openViewUser} close={setOpenViewUser} /> */}
            </div >
            <div className="h-[4.5%] pl-3 flex items-center">
                จำนวนแถวทั้งหมด : {inputvalue?.inputs?.length}
            </div>
            <Backdrop
                sx={{ color: '#fff', background: '#303030', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <Stack justifyContent={'center'} alignContent={'center'} alignItems={'center'} justifyItems={'center'} gap={1}>
                    <CircularProgress color="inherit" />
                    <Typography>กำลังโหลดข้อมูล</Typography>
                </Stack>
            </Backdrop>
            <Snackbar autoHideDuration={3000} anchorOrigin={{ vertical: "top", horizontal: "right" }} open={openSnackBar} onClose={() => setOpenSnackBar(false)}>
                <Alert onClose={() => setOpenSnackBar(false)} severity="success">
                    บันทึกข้อมูลสำเร็จแล้ว
                </Alert>
            </Snackbar>


            <Snackbar autoHideDuration={3000} anchorOrigin={{ vertical: "top", horizontal: "right" }} open={openSnackBarFalse.status} onClose={() => setOpenSnackBarFalse({ ...openSnackBarFalse, status: false })}>
                <Alert onClose={() => setOpenSnackBarFalse({ ...openSnackBarFalse, status: false })} severity="error">
                    {
                        openSnackBarFalse.msg
                    }

                </Alert>
            </Snackbar>


            <SpeedDial
                title="ลบทั้งหมด"
                onClick={() => handleDeleteAll()}
                ariaLabel="SpeedDial basic example"
                sx={{ position: 'absolute', bottom: 38, left: 38 }}
                icon={<DeleteIcon />}
            >
            </SpeedDial>
        </div >

    );
}
export default SealForecase;