import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  styled,
  AppBar,
  Toolbar,
  TextField,
  InputLabel,
  Alert,
  Slide,
} from "@mui/material";
import Logo from "../Assets/main.png";
import Bgimage from "../Assets/pg.png";

// Styled Components
const StyledBgImage = styled(Box)(({ theme }) => ({
  backgroundImage: `url(${Bgimage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  width: "100%",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
}));

const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "1.5rem",
  backgroundColor: `rgba(255, 255, 255, 0.3)`,
  borderRadius: "0.75rem",
  backdropFilter: "blur(4px)",
  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
  maxWidth: "300px",
  margin: "auto",
}));

const FormContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
});

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  backgroundColor: "transparent",
  boxShadow: "none",
}));

const AboutSection = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  padding: "1.5rem",
}));

const AboutContent = styled(Box)({
  textAlign: "center",
});

const CenteredLogo = styled("div")({
  display: "flex",
  alignItems: "center",
  flexGrow: 1,
});

// Signup Component
const Signup = () => {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      // Password validation
      if (userData.password.length < 8) {
        throw new Error("Password must be at least 8 characters long.");
      }

      const response = await axios.post(`${apiUrl}/api/signup`, userData);

      if (response && response.data) {
        setSignupSuccess(true);
        setTimeout(() => navigate("/login"), 1500);
      } else {
        console.error("Signup failed: No data in response");
      }
    } catch (error) {
      console.error(
        "Signup failed:",
        error.response ? error.response.data.message : error.message
      );
      setSignupError(error.message);
    }
  };

  return (
    <>
      <StyledAppBar>
        <Toolbar>
          <Box flexGrow={1} />
          <CenteredLogo>
            <img
              src={Logo}
              alt="My Logo"
              style={{ height: "40px", marginRight: "20px" }}
            />
          </CenteredLogo>
        </Toolbar>
      </StyledAppBar>

      <StyledBgImage>
        <Box
          display="flex"
          flexDirection="column"
          minHeight="100vh"
          position="relative"
        >
          {/* Alert Section */}
          <Box
            position="absolute"
            top="10px"
            width="100%"
            zIndex="9999"
            display="flex"
            justifyContent="center"
          >
            <Slide
              direction="down"
              in={signupSuccess}
              mountOnEnter
              unmountOnExit
              timeout={{ enter: 1000, exit: 500 }}
            >
              <Alert variant="filled" severity="success" color="secondary">
                Signup Successful
              </Alert>
            </Slide>
          </Box>

          {/* Signup Form */}
          <Box display="flex" flex={1} justifyContent="center" alignItems="center">
            <Wrapper>
              <Typography variant="h5" gutterBottom>
                Sign Up
              </Typography>

              <FormContainer>
                <InputLabel>Username</InputLabel>
                <TextField
                  type="text"
                  name="username"
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                />
                <InputLabel>Email</InputLabel>
                <TextField
                  type="email"
                  name="email"
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                />
                <InputLabel>Password</InputLabel>
                <TextField
                  type="password"
                  name="password"
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSignup}
                >
                  Sign Up
                </Button>

                {signupError && (
                  <Typography variant="body2" color="error">
                    {signupError}
                  </Typography>
                )}

                <Typography variant="body2" textAlign="center">
                  Already a user? <Link to="/login">Login</Link>
                </Typography>
              </FormContainer>
            </Wrapper>
          </Box>
        </Box>
      </StyledBgImage>

      {/* About Section */}
      <AboutSection>
        <AboutContent>
          <Typography variant="h6" gutterBottom>
            About NomadGram
          </Typography>
          <Typography variant="body1" gutterBottom>
            NomadGram is a social media platform for travelers, allowing users
            to share posts with images, location descriptions, and travel
            guides.
          </Typography>
          <Typography variant="body2">© 2024 From NomadGram</Typography>
        </AboutContent>
      </AboutSection>
    </>
  );
};

export default Signup;
