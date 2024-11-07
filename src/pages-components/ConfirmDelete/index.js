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
import { toast } from "react-toastify";

const ConfirmDelete = ({ open, setOpen, handleDeleteClick }) => {
    const [dontShowDeleteAgain, setDontShowDeleteAgain] = useState(false);

    useEffect(() => {
        const storedPreference = localStorage.getItem("dontShowDeleteAgain");
        if (storedPreference === "true") {
            setDontShowDeleteAgain(true);
        }
    }, []);

    const handleClose = () => setOpen(false);

    const handleConfirm = () => {
        handleDeleteClick();
        handleClose();
    };

    const handleCheckboxChange = (event) => {
        const { checked } = event.target;
        setDontShowDeleteAgain(checked);
        localStorage.setItem("dontShowDeleteAgain", checked);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete this record? This can not be undone.
                </DialogContentText>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={dontShowDeleteAgain}
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

export default ConfirmDelete;
