import * as React from 'react';
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';

const useStyles = makeStyles({
    root: {
        border: 0,
        borderRadius: 3,
        color: 'white',
        height: 48,
        padding: '0',
    },
});

export default function InpModel() {
    const classes = useStyles();
    return <TextField size="small" fullWidth sx={{
        "& .MuiInputBase-input": {
            padding: "4px 8px",
        },
    }} className={classes.root} />
}