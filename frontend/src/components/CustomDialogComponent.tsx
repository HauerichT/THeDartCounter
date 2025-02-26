import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  AlertColor,
} from "@mui/material";

interface DialogState {
  open: boolean;
  message: string;
  severity: AlertColor;
  onClose?: () => void;
}

export const CustomDialogComponent = ({
  dialog,
  setDialog,
}: {
  dialog: DialogState;
  setDialog: (state: DialogState) => void;
}) => {
  const handleClose = () => {
    if (dialog.onClose) dialog.onClose();
    setDialog({ ...dialog, open: false });
  };

  return (
    <Dialog open={dialog.open} onClose={handleClose}>
      <DialogContent>
        <Typography>{dialog.message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Weiter</Button>
      </DialogActions>
    </Dialog>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDialog = () => {
  const [dialog, setDialog] = React.useState<DialogState>({
    open: false,
    message: "",
    severity: "info",
  });

  const showDialog = (
    message: string,
    severity: AlertColor = "info",
    onClose?: () => void
  ) => {
    setDialog({
      open: true,
      message,
      severity,
      onClose,
    });
  };

  return { dialog, setDialog, showDialog };
};
