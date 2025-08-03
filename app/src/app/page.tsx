"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  createTheme,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  Paper,
  Radio,
  RadioGroup,
  Skeleton,
  Snackbar,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import { useHasAcceptedDataPolicy } from "./hooks/useHasAcceptedDataPolicy";
import { useSubmitDataPolicy } from "./hooks/useSubmitDataPolicy";
import { usePony } from "./hooks/usePony";
import { useSubmitPonyRating } from "./hooks/useSubmitPonyRating";
import ConfettiExplosion from "react-confetti-explosion";

const theme = createTheme({
  colorSchemes: {
    light: true,
    dark: true,
  },
  cssVariables: {
    colorSchemeSelector: "data"
  }
});

export default function Home() {
  const [niceness, setNiceness] = useState<number | null>(null);

  const {
    hasAccepted,
    isLoading: isDataPolicyLoading,
    fetchDataPolicyStatus,
  } = useHasAcceptedDataPolicy();

  const { declineDataPolicy, acceptDataPolicy, isSubmitting, error } =
    useSubmitDataPolicy();

  const { fetchPony, isLoading: isPonyLoading, pony, allDone } = usePony();

  const [imageLoaded, setImageLoaded] = useState(false);

  const {
    error: submissionError,
    isSubmitting: isSubmittingPonyRating,
    submitRating,
  } = useSubmitPonyRating();

  const [toast, setToast] = useState("");

  useEffect(() => {
    if (allDone) {
      setToast("You completed all the ponies!");
    }
  }, [allDone]);

  const handleToastClose = () => {
    setToast("");
  };

  const handleSubmit = async () => {
    if (!pony || !pony.id || !pony.name) {
      throw new Error(
        "Attempted to submit with an empty pony, this makes them sad."
      );
    }
    if (typeof niceness !== "number") {
      throw new Error("Niceness rating should be a number!");
    }

    try {
      await submitRating(pony.id, niceness);

      setNiceness(null);
      setToast("Submission received!");
      setImageLoaded(false);
      fetchPony();
    } catch (error) {
      setToast(error instanceof Error ? error.message : "Submission failed!");
    }
  };

  const handleSkip = async () => {
    if (!pony || !pony.id || !pony.name) {
      throw new Error(
        "Attempted to submit with an empty pony, this makes them sad."
      );
    }
    try {
      await submitRating(pony.id, -1);

      setNiceness(null);
      setToast("You skipped that pony!");
      setImageLoaded(false);
      fetchPony();
    } catch (error) {
      setToast(error instanceof Error ? error.message : "Skipping failed!");
    }
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <InitColorSchemeScript modeStorageKey="theme-mode" attribute="class" />
        <Paper
          className="flex items-center justify-center min-h-screen border-0"
          variant="outlined"
        >
          <Dialog open={!hasAccepted && !isDataPolicyLoading}>
            <DialogTitle className="text-center">
              The Pony Niceness Project's Data Policy
            </DialogTitle>
            <DialogContent className="flex flex-col gap-4">
              <Paper className="p-4 flex flex-col gap-2" variant="outlined">
                <Typography variant="body1">
                  We collect anonymized response data to study how people rate
                  pony niceness.
                </Typography>
                <Typography variant="body1">
                  No personally identifying information is stored or shared.
                </Typography>
              </Paper>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  onClick={() => {
                    declineDataPolicy().then(fetchDataPolicyStatus);
                  }}
                  className="flex-1"
                  color="error"
                  variant="contained"
                  sx={{ textTransform: "none", fontWeight: "bold" }}
                  loading={isSubmitting || isSubmittingPonyRating}
                >
                  I do not accept
                </Button>
                <Button
                  onClick={() => {
                    acceptDataPolicy().then(fetchDataPolicyStatus);
                  }}
                  className="flex-1"
                  variant="contained"
                  sx={{ textTransform: "none", fontWeight: "bold" }}
                  loading={isSubmitting || isSubmittingPonyRating}
                >
                  I accept
                </Button>
              </Box>
            </DialogContent>
          </Dialog>
          <Snackbar
            open={toast !== ""}
            autoHideDuration={3000}
            onClose={handleToastClose}
            message={toast}
          />

          {!allDone && (
            <Paper variant="outlined" sx={{ width: "fit-content" }}>
              <Card
                sx={{ fontWeight: "bold", textAlign: "center", px: 2, pb: 2 }}
              >
                <CardHeader
                  sx={{ pb: 0 }}
                  title={
                    <Typography variant="h5" fontWeight={600}>
                      How nice is this pony?
                    </Typography>
                  }
                  subheader={
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="textSecondary"
                    >
                      Upon initial introduction, e.g. "pre-redemption".
                    </Typography>
                  }
                />
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {isPonyLoading ? (
                    <Skeleton variant="text" width={200} sx={{ mt: 1 }} />
                  ) : (
                    <Typography
                      component={"p"}
                      variant="subtitle1"
                      color="textSecondary"
                    >
                      {pony?.name}
                    </Typography>
                  )}
                  <Skeleton
                    variant="rounded"
                    width={400}
                    height={400}
                    sx={{ display: imageLoaded ? "none" : "block" }}
                  />
                  <div className="p-2 rounded-lg shadow-lg">
                    <img
                      src={pony?.derpiUrl}
                      alt={pony?.name}
                      className="rounded-lg max-h-[200px] lg:max-h-[400px]"
                      style={{
                        display: imageLoaded ? "block" : "none",
                      }}
                      onLoad={() => {
                        setImageLoaded(true);
                      }}
                    />
                  </div>
                </CardContent>
                <FormControl className="w-full" sx={{ p: 2 }}>
                  <RadioGroup
                    value={niceness}
                    name="niceness-radio-group"
                    onChange={(e) => setNiceness(Number(e.target.value))}
                  >
                    <FormControlLabel
                      value={4}
                      control={<Radio />}
                      label="Very nice"
                    />
                    <FormControlLabel
                      value={3}
                      control={<Radio />}
                      label="Somewhat nice"
                    />
                    <FormControlLabel
                      value={2}
                      control={<Radio />}
                      label="Neither nice nor mean"
                    />
                    <FormControlLabel
                      value={1}
                      control={<Radio />}
                      label="Somewhat mean"
                    />
                    <FormControlLabel
                      value={0}
                      control={<Radio />}
                      label="Very mean"
                    />
                  </RadioGroup>
                  <FormGroup sx={{ display: "flex", gap: 1, pt: 2 }}>
                    <Button
                      variant="contained"
                      color="warning"
                      className="w-full"
                      onClick={handleSkip}
                      sx={{ textTransform: "none", fontWeight: "bold" }}
                    >
                      I'm not sure
                    </Button>
                    <Button
                      variant="contained"
                      className="w-full"
                      sx={{ textTransform: "none", fontWeight: "bold" }}
                      onClick={handleSubmit}
                      disabled={
                        niceness === null || isDataPolicyLoading || !hasAccepted
                      }
                    >
                      Submit
                    </Button>
                  </FormGroup>
                </FormControl>
              </Card>
            </Paper>
          )}

          {allDone && (
            <div className="flex flex-col text-center">
              <img
                id="you-did-it"
                src="https://derpicdn.net/img/2025/7/7/3636956/large.png"
              />
              <ConfettiExplosion />
            </div>
          )}
        </Paper>
      </ThemeProvider>
    </>
  );
}
