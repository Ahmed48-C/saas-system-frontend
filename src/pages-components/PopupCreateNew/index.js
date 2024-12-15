import React, { useEffect, useState } from "react";
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
} from "@material-ui/core";

const PopupCreateNew = ({ open, setOpen, handleSubmit, title, form, isPopupFormValid }) => {

    const handleClose = () => setOpen(false);

    const handleConfirm = () => {
        handleSubmit();
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Create a New {title}</DialogTitle>
            <DialogContent>
                {form}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleConfirm} color="primary" variant="contained" disabled={!isPopupFormValid()}>
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PopupCreateNew;