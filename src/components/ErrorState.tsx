import { Alert, AlertTitle, Button, Stack } from "@mui/material";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

const ErrorState = ({ message, onRetry }: ErrorStateProps) => {
  return (
    <Alert
      severity="error"
      sx={{
        borderRadius: 3,
        alignItems: "flex-start",
      }}
    >
      <AlertTitle>We’re having trouble loading events</AlertTitle>

      <Stack spacing={2}>
        <span>{message}</span>

        <Button
          variant="outlined"
          color="error"
          onClick={onRetry}
          sx={{ alignSelf: "flex-start" }}
        >
          Retry
        </Button>
      </Stack>
    </Alert>
  );
};

export default ErrorState;