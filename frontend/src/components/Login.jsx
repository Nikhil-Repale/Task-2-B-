import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Fade
} from "@mui/material";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/dashboard"); // Demo redirect
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #4f46e5, #3b82f6)",
      }}
    >
      <Fade in timeout={700}>
        <Paper
          elevation={10}
          sx={{
            padding: 4,
            width: 380,
            borderRadius: 4,
            backdropFilter: "blur(12px)",
            background:
              "rgba(255, 255, 255, 0.25)",
            boxShadow:
              "0 8px 32px rgba(31, 38, 135, 0.37)",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: 700,
              mb: 3,
              color: "#fff",
              textShadow: "0 1px 4px rgba(0,0,0,0.4)",
            }}
          >
            Smart HR Portal
          </Typography>

          <form onSubmit={handleLogin}>
            <TextField
              label="Email"
              fullWidth
              variant="outlined"
              sx={{
                mb: 2,
                input: { color: "#fff" },
                label: { color: "#eee" },
                "& .MuiOutlinedInput-root fieldset": {
                  borderColor: "rgba(255,255,255,0.4)",
                },
              }}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              sx={{
                mb: 3,
                input: { color: "#fff" },
                label: { color: "#eee" },
                "& .MuiOutlinedInput-root fieldset": {
                  borderColor: "rgba(255,255,255,0.4)",
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                paddingY: 1.2,
                borderRadius: 2,
                fontWeight: "bold",
                background:
                  "linear-gradient(90deg, #6366f1, #3b82f6)",
              }}
            >
              Login
            </Button>
          </form>
        </Paper>
      </Fade>
    </Box>
  );
}
