import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  IconButton,
  Grid,
  Paper,
  Avatar,
  Typography,
  Box,
  Tab,
  Tabs,
  Button,
  Zoom,
  CircularProgress,
} from "@mui/material";
import styled from "@emotion/styled";
import { ArrowBack } from "@mui/icons-material";
import { theme } from "./theme"; // Import the theme object
import Navbar from "./Navbar";
import DeleteIcon from "@mui/icons-material/Delete";

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

const MainProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [posts, setPosts] = useState([]);
  const [hoveredPost, setHoveredPost] = useState(null);
  const [travelGuides, setTravelGuides] = useState([]);
  const [showDeleteButtons, setShowDeleteButtons] = useState(false);
  const navigate = useNavigate();
  const { userId } = useParams();
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000'; // Ensure a fallback API URL

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
        const profileResponse = await axios.get(`${apiUrl}/api/user/${userId}`);
        setProfileData(profileResponse.data);

        // Fetch user posts if "Posts" tab is selected
        if (tabValue === 0) {
          const postsResponse = await axios.get(`${apiUrl}/posts/user/${userId}`);
          setPosts(postsResponse.data);
        }

        // Fetch user travel guides if the "Travel Guides" tab is selected
        if (tabValue === 1) {
          const travelGuidesResponse = await axios.get(
            `${apiUrl}/tg/fetchByUserId/${userId}`
          );
          setTravelGuides(travelGuidesResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId, tabValue, apiUrl]); // Dependencies include userId, tabValue, and apiUrl

  const handleDeleteClick = async (postId) => {
    try {
      // Send the HTTP DELETE request to delete the post
      const response = await axios.delete(
        `${apiUrl}/posts/deleteposts/${postId}`,
        {
          headers: {
            Authorization: token, // Include the authorization token
          },
        }
      );
      console.log(response.data);

      // Remove the deleted post from the posts state
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleDeleteGuide = async (guideId) => {
    try {
      const response = await axios.delete(`${apiUrl}/tg/delete/${guideId}`, {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200) {
        const refreshedResponse = await axios.get(
          `${apiUrl}/tg/fetchByUserId/${userId}`
        );
        setTravelGuides(refreshedResponse.data);
      } else {
        console.error("Failed to delete travel guide.");
      }
    } catch (error) {
      console.error("Error deleting travel guide:", error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleEditClick = () => {
    setShowDeleteButtons((prevState) => !prevState);
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
                      <StyledTypography variant="h5" gutterBottom>
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
                  <StyledTypography variant="h5" gutterBottom>
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
                  <div>
                    {tabValue === 0 && (
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="h5" gutterBottom>
                            Posts
                          </Typography>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleEditClick}
                          >
                            Edit
                          </Button>
                        </div>
                        <Grid container spacing={3}>
                          {posts.map((post) => (
                            <Grid item xs={12} sm={6} md={4} key={post._id}>
                              <Paper
                                style={{
                                  marginBottom: "10px",
                                  borderRadius: "15px",
                                  overflow: "hidden",
                                  position: "relative",
                                }}
                                onMouseEnter={() => setHoveredPost(post._id)}
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
                                          hoveredPost === post._id
                                            ? "brightness(50%)"
                                            : "none",
                                      }}
                                    />
                                  </div>
                                )}
                                <Typography variant="h6" style={{ margin: "10px" }}>
                                  {post.title}
                                </Typography>
                                <Typography variant="body2" style={{ margin: "10px" }}>
                                  {post.description}
                                </Typography>
                                {showDeleteButtons && (
                                  <IconButton
                                    onClick={() => handleDeleteClick(post._id)}
                                    style={{
                                      position: "absolute",
                                      top: "5px",
                                      right: "5px",
                                      color: "red",
                                    }}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                )}
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>
                      </div>
                    )}

                    {tabValue === 1 && (
                      <div>
                        <Typography variant="h5" gutterBottom>
                          Travel Guides
                        </Typography>
                        <Grid container spacing={3}>
                          {travelGuides.length > 0 ? (
                            travelGuides.map((guide) => (
                              <Grid item xs={12} sm={6} md={4} key={guide._id}>
                                <Paper
                                  style={{
                                    position: "relative",
                                    borderRadius: "15px",
                                    overflow: "hidden",
                                  }}
                                >
                                  <div
                                    style={{
                                      position: "relative",
                                      width: "100%",
                                      paddingTop: "100%",
                                    }}
                                  >
                                    <img
                                      src={`data:${guide.coverImage.contentType};base64,${guide.coverImage.data}`}
                                      alt="Cover"
                                      style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        borderRadius: "15px",
                                      }}
                                    />
                                  </div>
                                  <Typography
                                    variant="h6"
                                    style={{
                                      position: "absolute",
                                      bottom: "10px",
                                      left: "10px",
                                      color: "white",
                                    }}
                                  >
                                    {guide.title}
                                  </Typography>
                                  {showDeleteButtons && (
                                    <IconButton
                                      onClick={() => handleDeleteGuide(guide._id)}
                                      style={{
                                        position: "absolute",
                                        top: "5px",
                                        right: "5px",
                                        color: "red",
                                      }}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  )}
                                </Paper>
                              </Grid>
                            ))
                          ) : (
                            <Typography variant="body2" style={{ marginTop: "10px" }}>
                              No Travel Guides Available
                            </Typography>
                          )}
                        </Grid>
                      </div>
                    )}
                  </div>
                </StyledPaper>
              </Zoom>
            </Grid>
          </Grid>
        ) : (
          <CircularProgress />
        )}
      </Box>
    </div>
  );
};

export default MainProfile;
