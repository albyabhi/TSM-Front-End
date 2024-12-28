import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { theme } from "../theme";
import {
  Grid,
  Typography,
  Input,
  TextField,
  Button,
  IconButton,
  Container,
  Box,
  InputLabel,
  CircularProgress,
  Grow,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const ProfileEdWidget = ({ onClose }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [bio, setBio] = useState("");
  const [highlightedPlaces, setHighlightedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [savedImage, setSavedImage] = useState(null);
  const [username, setUserName] = useState("");
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [locations, setLocations] = useState([]);
  const [savedLocations, setSavedLocations] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setProfilePicture(file);

    // Update background image of the button
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setSavedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const [response, profileResponse, savedLocationsResponse] =
          await Promise.all([
            axios.get(`${process.env.REACT_APP_API_URL}/api/profile`, {
              headers: { Authorization: token },
            }),
            axios.get(`${process.env.REACT_APP_API_URL}/api/profiledata`, {
              headers: { Authorization: token },
            }),
            axios.get(`${process.env.REACT_APP_API_URL}/api/profiledata/savedlocations`, {
              headers: { Authorization: token },
            }),
          ]);

        if (isMounted) {
          setUserData(response.data);
          setUserName(response.data.username || "");
          setFirstName(response.data.firstName || "");
          setLastName(response.data.lastName || "");
          setPhoneNumber(response.data.phoneNumber || "");
          setBio(response.data.bio || "");
          setHighlightedPlaces(response.data.highlightedPlaces || []);
          setProfilePicture(profileResponse.profilePicture || null);
          setLoading(false);

          if (profileResponse.data && profileResponse.data.profilePicture) {
            const imageDataUri = `data:${
              profileResponse.data.profilePicture.contentType
            };base64,${profileResponse.data.profilePicture.data.toString(
              "base64"
            )}`;
            setSavedImage(imageDataUri);
          } else {
            console.log("No Profile Picture Found in the Response");
          }

          if (
            savedLocationsResponse.data &&
            savedLocationsResponse.data.length > 0
          ) {
            const savedLocationsData = savedLocationsResponse.data.map(
              (location) => ({
                value: location,
                label: location,
              })
            );
            setSavedLocations(savedLocationsData);
          } else {
            console.log("No Saved Locations Found in the Response");
          }

          setLoading(false);
        }
      } catch (error) {
        console.error(
          "Failed to fetch user data:",
          error.response?.data?.message
        );
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  useEffect(() => {
    if (userData) {
      console.log("Logged-in user ID:", userData.userId);
      setUserId(userData.userId);
    }
  }, [userData]);

  const viewProfileHandle = () => {
    navigate(`/mainview/${userId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleLocationSelect = (selectedOption) => {
    setSelectedLocations(selectedOption);
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/map/allfetchlocations`
        );
        const locationsData = response.data;
        const locationsOptions = locationsData.map((location) => ({
          value: location._id,
          label: location.name,
        }));
        setLocations(locationsOptions);
      } catch (error) {
        console.error("Error fetching locations:", error.response?.data?.message);
      }
    };

    fetchLocations();
  }, [navigate]);

  const handleSubmitChanges = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      console.log("Username sent in request body:", username);
      formData.append("bio", bio);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("phoneNumber", phoneNumber);

      selectedLocations.forEach((location, index) => {
        formData.append(`highlightedPlaces[${index}][value]`, location.value);
        formData.append(`highlightedPlaces[${index}][label]`, location.label);
      });
      formData.append("username", username);

      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/profile/update`,
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      onClose();
    } catch (error) {
      console.error("Error updating profile:", error.response?.data?.message);
    }
  };

  const Closing = () => {
    onClose();
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        style={{ height: "100vh" }}
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <Grow in={true}>
      <Box
        style={{
          marginTop: "9rem",
          marginBottom: "2rem",
          display: "flex",
          justifyContent: "center",
          paddingLeft: "1rem",
          paddingRight: "1rem",
        }}
      >
        <Container
          maxWidth="md"
          style={{
            padding: "1.5rem",
            backgroundColor: theme.palette.secondary.main,
            borderRadius: "0.75rem",
            overflowY: "auto",
            maxHeight: "80vh",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Grid item xs={12} container justifyContent="center">
                <Button
                  component="label"
                  htmlFor="profile-picture-upload"
                  variant="contained"
                  color="primary"
                  style={{
                    borderRadius: "50%",
                    width: "100px",
                    height: "100px",
                    marginBottom: "25px",
                    backgroundImage: `url(${savedImage})`,
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center",
                    position: "relative",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    align="center"
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      color: "white",
                    }}
                  >
                    Change Profile Picture
                  </Typography>
                  <input
                    type="file"
                    id="profile-picture-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </Button>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <InputLabel>Username</InputLabel>
                  <TextField
                    type="text"
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel>First name</InputLabel>
                  <TextField
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel>Last name</InputLabel>
                  <TextField
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel>Phone number</InputLabel>
                  <TextField
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel>Bio</InputLabel>
                  <TextField
                    multiline
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  {savedLocations.length > 0 && (
                    <div>
                      <InputLabel>Saved locations</InputLabel>
                      <ul>
                        {savedLocations.map((place, index) => (
                          <li key={index}>{place.label}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <InputLabel>Edit your locations</InputLabel>
                  <Select
                    isMulti
                    options={locations}
                    value={selectedLocations}
                    onChange={handleLocationSelect}
                    placeholder="Type to search or add locations"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid container spacing={2} justifyContent="center" style={{ marginTop: "1rem" }}>
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleSubmitChanges}>
                Save Changes
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={viewProfileHandle}>
                View your profile
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={Closing}>
                Close
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleLogout}>
                Logout
              </Button>
            </Grid>
          </Grid>

          <IconButton style={{ position: "absolute", top: "8px", right: "8px" }} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Container>
      </Box>
    </Grow>
  );
};

export default ProfileEdWidget;
