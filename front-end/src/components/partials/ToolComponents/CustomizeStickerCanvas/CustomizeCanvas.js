import { Modal, Box, Typography } from "@mui/material"

function CustomizeCanvas({open , handleClose}) {
    return  (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
        <Box className="modal-style">
            <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>
        </Box>
        </Modal>
    )
}

export default CustomizeCanvas;