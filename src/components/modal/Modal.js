import React from 'react';
import { Backdrop, Box, Fade, Modal as Model, Typography } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "50%",
    bgcolor: 'background.paper',
    border: '1px solid #000',
    borderRadius:"10px",
    boxShadow: 24,
    p: 4,
};

function Modal(props) {
    return (
        <Model
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={props.modalOpen}
            onClose={props.handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
            timeout: 500,
            }}
        >
            <Fade in={props.modalOpen}>
                <Box
                    sx={{
                        ...style,
                        height:props.height,
                        overflowY:props.overflowY,
                    }}
                >
                    {props.children}
                </Box>
            </Fade>
        </Model>
    )
}

export default Modal;


