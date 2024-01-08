import { Button, CircularProgress, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import Spreadsheet from "react-spreadsheet";
import { API_GET_SALE, API_UPDATE_SALE } from '../Service';
import { useSelector } from 'react-redux';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { ReactGrid, Column, Row } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
function ExcelPanel(props) {
    const { dataExcel } = props;
    const [loading, setLoading] = useState(true);
    const [col, setCol] = useState(["Customer", "ModelCode", "Sebango", "Pltype"]);
    const [row, setRow] = useState(["", "", "", "", "", "", "", "", "", ""]);
    const [excel, setExcel] = useState(dataExcel);
    const reducer = useSelector(state => state.reducer);
    console.log(reducer)
    useEffect(() => {
        init();
    }, [])
    async function init() {
        const day = await initCol();
        setCol([...col, ...day])
        const data = await API_GET_SALE({});
        console.log(data)
        const schema = ['customer', 'modelCode', 'sebango', 'pltype'];
        const initData = await data.map((v, i) => {
            let item = [];
            schema.map((vSchema, iSchema) => {
                item.push({ value: v[vSchema] })
            });
            [...Array(31)].map((vDay, iDay) => {
                item.push({ value: v[`d${(iDay + 1).toLocaleString('en', { minimumIntegerDigits: 2 })}`] })
            });
            return item
        });
        setExcel(initData);
        setLoading(false);
    }
    function initCol() {
        let days = [...Array(31)].map((i, v) => (
            (v + 1).toLocaleString('en', { minimumIntegerDigits: 2 })
        ))
        return days;
    }
    async function adjustSale(data) {
        await data.map((v, i) => {
            v.map((vv, ii) => {
                let value = typeof vv?.value != 'undefined' ? vv.value : "0";
                data[i][ii] = { value: value.toString() };
            })
        })
        return data;
    }
    async function handleUpdate(data) {
        data = await adjustSale(data);
        const update = await API_UPDATE_SALE({
            ym: '202301',
            data: data,
            empcode: reducer.empcode
        });
    }
    let rows = [];
    let columns = [
        { columnId: 'one', width: 150 }
    ];
    return <div className='wrapper'>
        {
            loading ? <Stack>
                <Typography>กำลังโหลดข้อมูล ...</Typography>
                <CircularProgress />
            </Stack> : <Stack spacing={1} p={2}>
                <Stack direction={'row'} spacing={1} justifyContent={'end'}>
                    <Button variant="contained" startIcon={<FileUploadIcon />}>แจกจ่าย</Button>
                </Stack>
                {/* <Spreadsheet data={excel} columnLabels={col} rowLabels={row} onChange={(e) => {
                    handleUpdate(e);
                }} /> */}
                <ReactGrid rows={rows} columns={columns} />
            </Stack>
        }

    </div>;
}

export default ExcelPanel 