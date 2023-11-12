import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
function DialogViewUser(props) {
    const { open, close } = props;
    return <>
        <Dialog open={open} onClose={() => close(false)} fullWidth maxWidth={'sm'} >
            <DialogTitle>
                ข้อมูลพนักงาน
            </DialogTitle>
            <DialogContent dividers>
                <DialogContentText>

                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => close(false)}>
                    ปิดหน้าต่าง
                </Button>
            </DialogActions>
        </Dialog>
    </>
}
export default DialogViewUser;