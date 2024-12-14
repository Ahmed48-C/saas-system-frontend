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

const ConfirmCancel = ({ open, setOpen, handleCancelClick }) => {
    const [dontShowCancelAgain, setDontShowCancelAgain] = useState(false);

    useEffect(() => {
        const storedPreference = localStorage.getItem("dontShowCancelAgain");
        if (storedPreference === "true") {
            setDontShowCancelAgain(true);
            // Automatically trigger cancel if preference is set
            if (open) {
                handleCancelClick();
                setOpen(false);
            }
        }
    }, [open, handleCancelClick, setOpen]);

    const handleClose = () => setOpen(false);

    const handleConfirm = () => {
        handleCancelClick();
        handleClose();
    };

    const handleCheckboxChange = (event) => {
        const { checked } = event.target;
        setDontShowCancelAgain(checked);
        localStorage.setItem("dontShowCancelAgain", checked);
    };

    if (dontShowCancelAgain && !open) return null; // Prevent dialog from rendering if preference is set

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to cancel this record? Your Input will be lost.
                </DialogContentText>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={dontShowCancelAgain}
                            onChange={handleCheckboxChange}
                            color="primary"
                        />
                    }
                    label="Don't show this again"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleConfirm} color="primary" variant="contained">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmCancel;