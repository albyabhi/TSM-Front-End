import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  IconButton,
  Grid,
  Paper,
  Avatar,
  Typography,
  Box,
  Tab,
  Tabs,
  CircularProgress,
  Zoom,
} from "@mui/material";
import styled from "@emotion/styled";
import { ArrowBack } from "@mui/icons-material";
import { theme } from "./theme"; // Import the theme object
import Navbar from "./Navbar";

const StyledPaper = styled(Paper)`
  padding: ${theme.spacing(3)};
  margin-bottom: ${theme.spacing(3)};
  margin-top: ${theme.spacing(3)};
  background-color: ${theme.palette.secondary.main};
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const StyledAvatar = styled(Avatar)`
  width: ${theme.spacing(20)};
  height: ${theme.spacing(20)};
  margin: auto;
`;

const StyledTypography = styled(Typography)`
  margin-bottom: ${theme.spacing(2)};
`;

const ProfileView = () => {
  const [profileData, setProfileData] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [posts, setPosts] = useState([]);
  const [hoveredPost, setHoveredPost] = useState(null);
  const [travelGuides, setTravelGuides] = useState([]);
  const navigate = useNavigate();
  const { userId } = useParams();
  const apiUrl = process.env.REACT_APP_API_URL; // Use the API URL from environment

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate, token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile data
        const profileResponse = await axios.get(
          `${apiUrl}/api/user/${userId}` // Use apiUrl
        );
        setProfileData(profileResponse.data);

        // Fetch user posts
        const postsResponse = await axios.get(
          `${apiUrl}/posts/user/${userId}` // Use apiUrl
        );
        console.log("User Posts:", postsResponse.data);
        setPosts(postsResponse.data);

        // Fetch user travel guides if the "Travel Guides" tab is selected
        const travelGuidesResponse = await axios.get(
          `${apiUrl}/tg/fetchByUserId/${userId}` // Use apiUrl
        );
        console.log("User Travel Guides:", travelGuidesResponse.data);
        setTravelGuides(travelGuidesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId, tabValue, apiUrl]); // Add apiUrl as dependency
  console.log("Travel Guides:", travelGuides);
  if (travelGuides && Array.isArray(travelGuides.travelGuides)) {
    travelGuides.travelGuides.forEach((guide) => {
      console.log("Feature Destination Name:", guide.featureDestination.name);
    });
  } else {
    console.log("Travel guides not available or invalid format.");
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  if (!userId) {
    return <p>No user ID provided.</p>;
  }

  return (
    <div>
      <Navbar />
      <Box m={{ xs: 2, md: 0 }}>
        <IconButton
          onClick={handleGoBack}
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <ArrowBack />
        </IconButton>

        {profileData ? (
          <Grid container justifyContent="center" spacing={4}>
            <Grid item xs={12} md={8}>
              <Zoom in={true}>
                <StyledPaper>
                  <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={4}>
                      <StyledAvatar
                        alt="Profile Picture"
                        src={`data:${profileData.profilePicture.contentType};base64,${profileData.profilePicture.data}`}
                      />
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <StyledTypography
                        variant="h5"
                        gutterBottom
                        style={{
                          color: "#333",
                          marginBottom: "20px",
                          borderBottom: "1px solid #ccc",
                          paddingBottom: "10px",
                        }}
                      >
                        Personal Information
                      </StyledTypography>
                      <StyledTypography variant="subtitle1">
                        <strong>Username:</strong> {profileData.username}
                      </StyledTypography>
                      <StyledTypography variant="subtitle1">
                        <strong>Bio:</strong> {profileData.bio}
                      </StyledTypography>
                      <StyledTypography variant="subtitle1">
                        <strong>Email:</strong> {profileData.email}
                      </StyledTypography>
                      <StyledTypography variant="subtitle1">
                        <strong>Phone Number:</strong> {profileData.phoneNumber}
                      </StyledTypography>
                    </Grid>
                  </Grid>
                </StyledPaper>
              </Zoom>

              <Zoom in={true}>
                <StyledPaper>
                  <StyledTypography
                    variant="h5"
                    gutterBottom
                    style={{
                      color: "#333",
                      marginBottom: "20px",
                      borderBottom: "1px solid #ccc",
                      paddingBottom: "10px",
                    }}
                  >
                    Highlighted Places
                  </StyledTypography>
                  {profileData.highlightedPlaces &&
                  profileData.highlightedPlaces.length > 0 ? (
                    <ul>
                      {profileData.highlightedPlaces.map((place, index) => (
                        <li key={index}>
                          {typeof place === "object" ? place.label : place}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <StyledTypography variant="subtitle1">
                      No highlighted places found.
                    </StyledTypography>
                  )}
                </StyledPaper>
              </Zoom>

              <Zoom in={true}>
                <StyledPaper>
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                  >
                    <Tab label="Posts" />
                    <Tab label="Travel Guides" />
                  </Tabs>
                  {tabValue === 0 && (
                    <div>
                      <Typography
                        variant="h5"
                        gutterBottom
                        style={{
                          color: "#333",
                          marginBottom: "20px",
                          borderBottom: "1px solid #ccc",
                          paddingBottom: "10px",
                        }}
                      >
                        Posts
                      </Typography>
                      <Grid container spacing={3}>
                        {posts.map((post) => (
                          <Grid item xs={12} sm={6} md={4} key={post.postId}>
                            <Paper
                              style={{
                                marginBottom: "10px",
                                borderRadius: "15px",
                                overflow: "hidden",
                                position: "relative",
                              }}
                              onMouseEnter={() => setHoveredPost(post.postId)}
                              onMouseLeave={() => setHoveredPost(null)}
                            >
                              {post.postImage && (
                                <div
                                  style={{
                                    position: "relative",
                                    width: "100%",
                                    paddingTop: "100%",
                                    overflow: "hidden",
                                  }}
                                >
                                  <img
                                    src={`data:${post.postImage.contentType};base64,${post.postImage.data}`}
                                    alt="Post"
                                    style={{
                                      position: "absolute",
                                      top: 0,
                                      left: 0,
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                      borderRadius: "15px",
                                      filter:
                                        hoveredPost === post.postId
                                          ? "blur(5px)"
                                          : "none",
                                      transition: "filter 0.3s ease-in-out",
                                    }}
                                  />
                                  {hoveredPost === post.postId && (
                                    <div
                                      style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        padding: "5px",
                                      }}
                                    >
                                      <Typography
                                        variant="body2"
                                        style={{ color: "white" }}
                                      >
                                        {post.likes.length} Likes{" "}
                                      </Typography>
                                    </div>
                                  )}
                                </div>
                              )}
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </div>
                  )}
                  {tabValue === 1 && (
                    <div style={{ marginTop: "20px" }}>
                      <Typography
                        variant="h5"
                        gutterBottom
                        style={{
                          color: "#333",
                          marginBottom: "20px",
                          borderBottom: "1px solid #ccc",
                          paddingBottom: "10px",
                        }}
                      >
                        Travel Guides
                      </Typography>
                      {travelGuides.travelGuides ? (
                        travelGuides.travelGuides.map((guide, index) => (
                          <Link
                            key={index}
                            to={`/travelguideView/${guide._id}/${guide.userId}`}
                            style={{ textDecoration: "none" }}
                          >
                            <StyledPaper
                              style={{
                                marginBottom: "20px",
                                backgroundImage: `url('data:${guide.featureDestination.image.contentType};base64,${guide.featureDestination.image.data}')`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                borderRadius: "10px",
                                padding: "20px",
                              }}
                            >
                              <Grid container spacing={2}>
                                <Grid item xs={12} sm={8}>
                                  <StyledTypography
                                    variant="h6"
                                    gutterBottom
                                    style={{
                                      marginBottom: "10px",
                                      color: "#fff", // Text color
                                      textShadow:
                                        "0 6px 4px rgba(0, 0, 0, 0.5)", // Text shadow
                                    }}
                                  >
                                    {guide.featureDestination.name}
                                  </StyledTypography>
                                  <StyledTypography
                                    variant="body1"
                                    style={{
                                      marginBottom: "10px",
                                      color: "#fff", // Text color
                                      textShadow:
                                        "0 6px 4px rgba(0, 0, 0, 0.5)", // Text shadow
                                    }}
                                  >
                                    {guide.featureDestination.description}
                                  </StyledTypography>
                                </Grid>
                              </Grid>
                            </StyledPaper>
                          </Link>
                        ))
                      ) : (
                        <Typography variant="body1">
                          Loading travel guides...
                        </Typography>
                      )}
                    </div>
                  )}
                </StyledPaper>
              </Zoom>
            </Grid>
          </Grid>
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{ height: "100vh" }}
          >
            <CircularProgress style={{ color: "black" }} size={40} />
          </Box>
        )}
      </Box>
    </div>
  );
};

export default ProfileView;
