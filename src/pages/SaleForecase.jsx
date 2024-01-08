import { Box, Grid, Backdrop, Stack, Snackbar, TableContainer, TextField, Avatar, Typography, Button, Alert, Paper, Select, Menu, MenuItem, Table, TableHead, TableRow, TableCell, TableBody, IconButton, InputBase, CircularProgress, Divider, List, SpeedDial } from "@mui/material";
import { useEffect, useState } from "react";
import { API_DELETE_ALL_DATA, API_GET_SALE_FORCAST, ServiceGetCustomers, ServiceGetModels, ServiceGetPltype, ServiceGetUser, API_SAVE_SALE_FORCAST, API_GET_SALE_OF_MONTH, API_UPDATE_ROW, API_GET_SALE } from "../Service";
import moment from "moment";
import parse from "paste-from-excel";
import SaveIcon from '@mui/icons-material/Save';
// import { useStyles } from "../styled";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import React from "react";
import Card from '@mui/material/Card';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import ExcelPanel from "../components/ExcelComponent";
function SealForecase() {
    // customer name , model name,sebango,pltype
    const edit = useSelector(state => state.reducer.edit);
    let month = edit.month;
    let year = edit.year;
    const reducer = useSelector(state => state.reducer);
    const reduxFilter = useSelector(state => state.reducer.filter);
    const dispatch = useDispatch();
    const empcode = reducer?.empcode;
    const [loading, setLoading] = useState(false);
    const [days, setDays] = useState([]);
    const [countRow, setCountRow] = useState(10);
    const [newRow, setNewRow] = useState(10);
    const [inputvalue, setinputvalue] = useState({});
    // const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const [yearSelected, setYearSelected] = useState(typeof reduxFilter.year != 'undefined' ? reduxFilter.year : moment().format('YYYY'));
    const [monthSelected, setMonthSelected] = useState(typeof reduxFilter.month != 'undefined' ? reduxFilter.month : moment().format('MM'));
    const [startDate, setStartDate] = useState(moment().format('YYYY-MM-01').toString());
    const [endDate, setEndDate] = useState(moment().endOf('month').format('YYYY-MM-DD'));
    const yearNow = moment().format('YYYY');
    const [openMsg, setOpenMsg] = useState(0);
    const [message, setMessage] = useState('ทดสอบระบบ');
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [openSnackBarFalse, setOpenSnackBarFalse] = useState(false);
    const [model, setmodel] = useState([]);
    const [customer, setcustomer] = useState([]);
    const [pltype, setpltype] = useState([]);
    const [svus, setSvus] = useState(["ALL", "1YC", "2YC", "SCR", "ODM"]);
    const [svuSelected, setSvuSelected] = useState(svus[0]);
    const [checkedEdit, setCheckEdit] = useState(false);
    const [change, setChange] = useState(false);
    const [excel, setExcel] = useState([]);
    // const [loading, setLoading] = useState(true);
    const handlePaste = (index, elm, e, i) => {
        setChange(true);
        return parse(e);
    };

    async function handleUpdate() {
        let listUpdate = await inputvalue.inputs.filter((item) => {
            item['ym'] = `${year}${month.toLocaleString('en', { minimumIntegerDigits: 2 })}`;
            [...Array(31)].map((v, num) => {
                let day = num + 1;
                let colDay = `d${day.toLocaleString('en', { minimumIntegerDigits: 2 })}`;
                let valOfDay = (typeof item[colDay] != 'undefined' && item[colDay]) ? parseInt(item[colDay]) : 0;
                item[colDay] = valOfDay;
            })
            return item;
        });
        listUpdate = await listUpdate.filter((item) => {
            let iCustomer = (typeof item.customer != 'undefined' && item.customer != '') ? true : false;
            let iModelCode = (typeof item.modelCode != 'undefined' && item.modelCode != '') ? true : false;
            let iSebango = (typeof item.sebango != 'undefined' && item.sebango != '') ? true : false;
            let iPlType = (typeof item.pltype != 'undefined' && item.pltype != '') ? true : false;
            return (typeof item.id == 'undefined' && iCustomer && iModelCode && iSebango && iPlType) || (typeof item.id != 'undefined' && iCustomer && iModelCode && iSebango && iPlType)
        });
        if (listUpdate.length > 0) {
            console.log(listUpdate)
            const update = await API_UPDATE_ROW({
                year: year,
                month: month,
                listalforecast: listUpdate
            });
            if (update.status > 0) {
                setinputvalue({ inputs: listUpdate })
            }
        }
    }

    // async function handleChange(val, iRow, col) {
    //     let row = inputvalue.inputs[iRow];
    //     row[col] = (col == 'customer' || col == 'modelCode' || col == 'plType' || col == 'sebango') ? val : parseInt(val);
    //     row['ym'] = `${year}${month.toLocaleString('en', { minimumIntegerDigits: 2 })}`;
    //     // let canUpdate = true;
    //     // if (col == 'customer') {
    //     //     let haveCustomer = customer.filter(item => item.customerNameShort == val);
    //     //     if (Object.keys(haveCustomer).length == 0) {
    //     //         canUpdate = false;
    //     //     }
    //     // }
    //     // if (col == 'modelCode' && canUpdate == true) {
    //     //     let haveModel = model.filter(item => item.model == val);
    //     //     if (Object.keys(haveModel).length == 0) {
    //     //         canUpdate = false;
    //     //     }
    //     // }
    //     [...Array(31)].map((item, index) => {
    //         let day = index + 1;
    //         let colDay = `d${day.toLocaleString('en', { minimumIntegerDigits: 2 })}`;
    //         let valOfDay = (typeof row[colDay] != 'undefined' && row[colDay]) ? parseInt(row[colDay]) : 0;
    //         row[colDay] = valOfDay;
    //     });
    //     // if (canUpdate) {
    //     //     const update = await API_UPDATE_ROW({
    //     //         id: row.id,
    //     //         column: col,
    //     //         val: parseInt(val),
    //     //         alforecast: row
    //     //     });
    //     //     console.log(update)
    //     //     if(update?.status > 0){
    //     //         row['id'] = update.id;
    //     //     }
    //     // }
    // }
    const handleLogout = () => {
        if (confirm('คุณต้องการออกจากระบบใช่หรือไม่ ?')) {
            dispatch({ type: 'LOGIN', payload: { login: false } })
        }
    }
    const handlePasteRun = (index, elm, e, i) => {
        setinputvalue((inputvalue) => ({
            ...inputvalue,
            inputs: inputvalue.inputs.map((item, i) =>
                index === i
                    ? {
                        ...item,
                        [elm]: (elm != 'modelCode' && elm != 'pltype' && elm != 'customer' && elm != 'sebango') ? ((e.target.value != '' && e.target.value != '-') ? parseInt(e.target.value) : '') : (elm == 'customer' ? e.target.value.toUpperCase() : e.target.value)
                    }
                    : item
            )
        }));
    };
    async function init() {
        const dataExcel = await initialContent();
        setExcel(dataExcel);
        // setLoading(true);
        // await initialContent();
        // const resModel = await ServiceGetModels();
        // const resCustomer = await ServiceGetCustomers();
        // const resPltype = await ServiceGetPltype();
        // setcustomer(resCustomer);
        // setmodel(resModel);
        // setpltype(resPltype);
        // setLoading(false);
    }
    async function getData() {
        const res = await API_GET_SALE_OF_MONTH({ year: year, month: month });
    }

    async function handleDeleteAll() {
        if (confirm('คุณต้องการลบรายการทั้งหมด ใช่หรือไม่')) {
            var data = inputvalue.inputs;
            data.map((item, index) => {
                Object.keys(item).map((el, ind) => {
                    data[index][el] = "";
                })
            })
            const delAll = await API_DELETE_ALL_DATA({ ym: `${year}${month.toLocaleString('en', { minimumIntegerDigits: 2 })}` });
            setinputvalue({ ...inputvalue, inputs: [...data] })
        }
    }
    const initialContent = async () => {
        // const data = await API_GET_SALE({});
        // console.log(data)
        // setLoading(false);
        // const schema = ['customer', 'modelCode', 'sebango', 'pltype'];
        // const initData = await data.map((v, i) => {
        //     let item = [];
        //     schema.map((vSchema, iSchema) => {
        //         item.push({ value: v[vSchema] })
        //     });
        //     return item
        // });
        // return initData;
        // let rowCount = 0;
        // const saleforecase = await API_GET_SALE_OF_MONTH({
        //     year: year,
        //     month: month
        // });
        // rowCount = countRow;
        // if (saleforecase.length > 10 && rowCount < saleforecase.length) {
        //     rowCount = saleforecase.length
        //     setCountRow(rowCount)
        // }
        // console.log(rowCount)
        // setDays([]);
        // var initDays = [];
        // var i = 0;
        // var input = { inputs: [] };
        // while (i < rowCount) {
        //     var colInput = {};
        //     var a = moment(startDate);
        //     var b = moment(endDate);
        //     initDays = []
        //     initDays.push('customer');
        //     initDays.push('modelCode');
        //     initDays.push('sebango')
        //     initDays.push('pltype');
        //     for (var m = moment(a); m <= b; m.add(1, 'days')) {
        //         initDays.push('d' + m.format('DD'));
        //     }
        //     if (typeof saleforecase[i] !== 'undefined') {
        //         colInput = saleforecase[i];
        //     } else {

        //         if (typeof inputvalue.inputs != 'undefined' && i < inputvalue.inputs.length) {
        //             colInput = inputvalue.inputs[i]
        //         }
        //     }
        //     input.inputs.push(colInput)
        //     i++;
        // }
        // setinputvalue({ ...input })
        // setDays([...initDays]);
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
    // const handleSave = async () => {
    //     var data = []
    //     var empty = [];
    //     var checkPltype = true;
    //     setLoading(true);
    //     inputvalue.inputs.map((item, index) => {
    //         var row = inputvalue.inputs[index];
    //         var errors = [];
    //         let checkSebango = handleCheckSebango(model, 'modelCode', row['sebango'], row['modelCode']);
    //         errors['customer'] = handleCheck(customer, 'customerNameShort', row['customer']);
    //         errors['modelCode'] = handleCheck(model, 'model', row['modelCode']);
    //         errors['pltype'] = handleCheck(pltype, 'pltype', row['pltype']);
    //         errors['sebango'] = checkSebango.error;
    //         inputvalue.inputs[index]['id'] = 0;
    //         if (typeof inputvalue.inputs[index]['modelCode'] != 'undefined' && inputvalue.inputs[index]['modelCode'] != '') {
    //             if (inputvalue.inputs[index]['pltype'] == '' || typeof inputvalue.inputs[index]['pltype'] == 'undefined') {
    //                 setMessage('กรุณากรอกข้อมูล PLTYPE ')
    //                 setOpenMsg(1);
    //                 inputvalue.inputs[index]['warning'] = 1;
    //                 checkPltype = false;
    //             }
    //             inputvalue.inputs[index]['sebango'] = checkSebango.sebango;
    //             inputvalue.inputs[index]['modelCode'] = inputvalue.inputs[index]['modelCode'];
    //             inputvalue.inputs[index]['modelName'] = inputvalue.inputs[index]['modelCode'];
    //             inputvalue.inputs[index]['ym'] = yearSelected + '' + monthSelected;
    //             inputvalue.inputs[index]['ym'] = `${yearSelected}${monthSelected.toLocaleString('en', { minimumIntegerDigits: 2, useGrouping: false })}`;
    //             inputvalue.inputs[index]['lrev'] = '999';
    //             inputvalue.inputs[index]['createBy'] = empcode.toString();
    //             inputvalue.inputs[index]['customer'] = inputvalue.inputs[index]['customer'].toString();
    //             inputvalue.inputs[index]['createDate'] = '2023-10-04T07:53:51.258Z';
    //             inputvalue.inputs[index]['error'] = errors;
    //             data.push(inputvalue.inputs[index])
    //         } else {
    //             inputvalue.inputs[index]['pltype'] = '';
    //             inputvalue.inputs[index]['modelCode'] = '';
    //             inputvalue.inputs[index]['modelName'] = '';
    //             inputvalue.inputs[index]['ym'] = '';
    //             inputvalue.inputs[index]['lrev'] = '';
    //             inputvalue.inputs[index]['createBy'] = '';
    //             inputvalue.inputs[index]['createDate'] = '';
    //             inputvalue.inputs[index]['error'] = [];
    //             Object.keys(inputvalue.inputs[index]).map((key) => {
    //                 inputvalue.inputs[index][key] = '';
    //             })
    //             empty.push(inputvalue.inputs[index])
    //         }
    //     });

    //     var validate = true;
    //     inputvalue.inputs.map((el, index) => {
    //         if (Object.values(el.error).includes(1)) {
    //             validate = false;
    //         }
    //     });
    //     if (validate == false) {
    //         setMessage('ข้อมูลของคุณยังไม่ถูกต้องตามที่ระบบต้องการ')
    //         setOpenMsg(1);
    //         setinputvalue({ ...inputvalue, inputs: [...data] })
    //         setOpenSnackBarFalse({ ...openSnackBarFalse, msg: 'ข้อมูลของคุณยังไม่ถูกต้องตามที่ระบบต้องการ', status: true })
    //         setLoading(false);
    //     } else {
    //         if (checkPltype != false) {
    //             var canSave = true;
    //             var indexRow = 0;
    //             data.map((item, index) => {
    //                 var i = 1;
    //                 var warning = 0;
    //                 while (i <= 31) {
    //                     var key = `d` + i.toLocaleString('en', { minimumIntegerDigits: 2, useGrouping: false });
    //                     item[key] = (item[key] != '' && typeof item[key] !== 'undefined') ? item[key] : 0;
    //                     if (item[key] > 100000) {
    //                         warning = 1;
    //                         canSave = false;
    //                         setMessage('ระบบไม่รองรับตัวเลขที่มากกว่า 6 ตำแหน่ง')
    //                         setOpenMsg(1);
    //                     }
    //                     i++;
    //                 }
    //                 data[index]['row'] = indexRow;
    //                 data[index]['warning'] = warning;
    //                 indexRow++;
    //             })
    //             if (canSave) {
    //                 console.log(data)
    //                 const save = await API_SAVE_SALE_FORCAST({ listalforecast: data, ym: `${year}${month.toLocaleString('en', { minimumIntegerDigits: 2 })}` });
    //                 console.log(save);
    //                 // const save = await API_SAVE_SALE_FORCAST({ data: data, ym: `${yearSelected}${monthSelected.toLocaleString('en', { minimumIntegerDigits: 2 })}` }).then((res) => {
    //                 //     return res
    //                 // });
    //                 // if (save.status || (save.status == false && data.length == 0)) {
    //                 //     setMessage('บันทึกข้อมูลสำเร็จแล้ว ' + moment().format('DD/MM/YYYY HH:mm:ss'))
    //                 //     setOpenMsg(2);
    //                 //     setinputvalue({ ...inputvalue, inputs: [...data, ...empty] });
    //                 //     setOpenSnackBar(true);
    //                 // } else {
    //                 //     setMessage('เกิดข้อผิดพลาดกับข้อมูล กรุณาติดต่อ IT (250,611) เบียร์ ' + moment().format('DD/MM/YYYY HH:mm:ss'))
    //                 //     setOpenMsg(1);
    //                 //     setOpenSnackBarFalse({ ...openSnackBarFalse, status: true, msg: 'เกิดข้อผิดพลาดกับข้อมูล กรุณาติดต่อ IT (250,611) เบียร์' })
    //                 // }
    //                 setLoading(false);
    //             } else {
    //                 setOpenSnackBar(true);
    //                 setLoading(false);
    //             }
    //         }
    //     }
    // }
    const handleAddRow = () => {
        let count = parseInt(countRow) + parseInt(newRow);
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
        // if (change) {
        //     setTimeout(() => {
        //         // handleSave();
        //         handleUpdate();
        //         setChange(false);
        //     }, 1500);
        // } else {
        //     init();
        // }
        // init();
        // return;
    }, [excel]);
    return (
        <div className="h-[92.5%]">
            <div className="h-full p-3 bg-[#dbe2ed]">
               
                <ExcelPanel dataExcel={excel} />
                {/* <Paper className="h-[100%]">
                    <Stack direction={'row'} p={2} justifyContent={'space-between'}>
                        <Stack direction={'row'}>
                            <Stack direction={'row'} alignItems={'center'} gap={2}>
                                <Stack direction={'row'}>
                                    <Typography>YEAR : {year}</Typography>
                                </Stack>
                                <Stack direction={'row'}>
                                    <Typography>MONTH : {moment().month(month - 1).format('MMM').toUpperCase()}</Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                        <Stack direction={'row'} alignItems={'center'} gap={1}>
                            <TextField type="number" value={newRow} size="small" onChange={(e) => {
                                setNewRow(e.target.value)
                            }} />
                            <Button variant='contained' onClick={() => handleAddRow()} startIcon={<AddCircleIcon />}> เพิ่มแถว </Button>
                        </Stack>
                    </Stack>
                    <Stack direction={'row'} alignItems={'start'} px={2} pt={0} pb={2} gap={2}>
                        <Card className="px-3 py-3 h-[65px] flex justify-center items-center gap-2" >
                            <Typography>เวอร์ชั่น </Typography>
                            <Typography variant="button" className="text-[1.5rem] font-semibold text-red-500"> 1.0</Typography>
                        </Card>
                        <Card className="pl-3 pr-6 py-3 h-[65px] flex items-center" >
                            <Stack direction={'row'} gap={2}>
                                <Button variant='contained' color="success" onClick={() => handleSave()} startIcon={<TaskAltIcon />} > แจกจ่าย</Button>
                            </Stack>
                        </Card>
                    </Stack>
                    <div className="wrapper">
                        {
                            (openMsg == 1 || openMsg == 2) && <div className="pb-2">
                                <Alert severity={`${openMsg == 2 ? 'success' : 'error'}`}>{message}</Alert>
                            </div>
                        }
                        <table>
                            <tbody>
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
                                                    {
                                                        days.map((elm, i) => {
                                                            return (
                                                                <td
                                                                    className={elm == 'modelCode' ? 'sticky' : ''}
                                                                    key={i}
                                                                    style={{
                                                                        minHeight: "30px",
                                                                        border: "1px solid black",
                                                                        borderRadius: "0px",
                                                                        wordWrap: "break-word"
                                                                    }}
                                                                >
                                                                    <input
                                                                        size="small"
                                                                        lang="en"
                                                                        onInput={(e) => {
                                                                            handlePasteRun(index, elm, e, i);
                                                                        }}
                                                                        onPaste={(e) => {
                                                                            console.log(e.target.value)
                                                                            handlePaste(index, elm, e, i);
                                                                        }}
                                                                        onChange={(e) => {
                                                                            handleChange(e.target.value, index, elm)
                                                                        }}
                                                                        type={`${(elm == 'customer' || elm == 'modelCode' || elm == 'pltype' || elm == 'sebango') ? 'text' : 'text'}`}
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
                            </tbody>
                        </table>
                    </div>
                </Paper> */}
            </div >
            <Backdrop
                className="select-none"
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