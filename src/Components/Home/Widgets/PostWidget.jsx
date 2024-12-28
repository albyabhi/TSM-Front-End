import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, Avatar, Grid, CircularProgress, Grow } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LikeIcon from "../Icons/Like.png";
import LikedIcon from "../Icons/Liked.png";
import CommentIcon from "../Icons/comment.png";
import CommentSection from "./CommentSection";

const PostWidget = ({ post }) => {
  const { userId, postImage, description } = post;
  const [loading, setLoading] = useState(true); // State to track loading
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [likeStatus, setLikeStatus] = useState("");
  const [showCommentSection, setShowCommentSection] = useState(false); // State to control visibility of comment section
  const [comments, setComments] = useState([]);

  const fetchUserData = useCallback(async () => {
    try {
      const [userResponse, profileDataResponse, likeCountResponse] =
        await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/user/${userId}`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/profiledata/${userId}`),
          axios.get(`${process.env.REACT_APP_API_URL}/posts/like/count/${post._id}`, {
            headers: { Authorization: token },
          }),
        ]);

      const user = userResponse.data;
      const likeCount = likeCountResponse.data.count;
      const profileData = profileDataResponse.data;
      const likeStatus = likeCountResponse.data.likeStatus;
      setUserData(user);
      setLikeStatus(likeStatus);
      setProfileData(profileData);
      setLikeCount(likeCount);
      setLoading(false); // Update loading state once data is fetched
    } catch (error) {
      console.error(
        "Error fetching user data:",
        error.response?.data?.message
      );
    }
  }, [userId, post._id, token]); // Added token as a dependency

  const fetchComments = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/posts/fetchcomments/${post._id}`
      );
      setComments(response.data.comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }, [post._id]); // Added post._id as a dependency

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]); // Fetch user data on mount or when fetchUserData changes

  useEffect(() => {
    fetchComments();
  }, [fetchComments]); // Fetch comments on mount or when fetchComments changes

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");

      // Toggle likeStatus locally
      const updatedLikeStatus = likeStatus === "like" ? "liked" : "like";
      setLikeStatus(updatedLikeStatus);

      // Adjust likeCount locally based on likeStatus
      const updatedLikeCount = likeCount + (likeStatus === "like" ? 1 : -1);
      setLikeCount(updatedLikeCount);

      // Send request to the server to update the like status
      await axios.post(`${process.env.REACT_APP_API_URL}/posts/like/${post._id}`, null, {
        headers: { Authorization: token },
      });
    } catch (error) {
      console.error("Error liking post:", error.response?.data?.message);
    }
  };

  const handleComment = async (commentText) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_API_URL}/posts/comment/${post._id}`,
        { text: commentText },
        {
          headers: { Authorization: token },
        }
      );

      // Refresh post data after commenting
      fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error.response?.data?.message);
    }
  };

  const navigateToProfile = () => {
    navigate(`/profileview/${userData.userId}`); // Navigate to profile view
  };

  const toggleCommentSection = () => {
    setShowCommentSection(!showCommentSection); // Toggle visibility of comment section
  };

  return (
    <Grid
      container
      direction="column"
      boxShadow="0 0 10px rgba(0, 0, 0, 0.1)"
      borderRadius="0.75rem"
      backgroundColor="secondary.main"
      padding="1.5rem"
      sx={{
        maxWidth: "100%", // Set maximum width to 100% for responsiveness
        width: "100%", // Ensure the width is also set to 100% to fill the parent container
        margin: "auto", // Center the widget horizontally
        boxSizing: "border-box", // Include padding and border in the width calculation
        "@media (min-width: 600px)": {
          maxWidth: "600px", // Limit the maximum width to 400px on larger screens
          marginBottom: "1rem", // Add space below each PostWidget on larger screens
        },
      }}
      marginBottom={{ xs: "1rem", md: 0 }} // Add space below each PostWidget for small screens
    >
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {userData && profileData && (
            <Grow in={!loading} timeout={500}>
              <Grid container alignItems="center" marginBottom="1rem">
                <Grid item>
                  <Avatar
                    alt={userData.username}
                    src={`data:${profileData.profilePicture.contentType};base64,${profileData.profilePicture.data.toString(
                      "base64"
                    )}`}
                    onClick={navigateToProfile}
                    style={{ cursor: "pointer" }}
                  />
                </Grid>
                <Grid item>
                  <Typography
                    variant="subtitle1"
                    fontWeight="500"
                    onClick={navigateToProfile}
                    style={{ cursor: "pointer", marginLeft: "0.5rem" }}
                  >
                    {userData.username}
                  </Typography>
                </Grid>
              </Grid>
            </Grow>
          )}

          <Typography variant="body1" marginBottom="1rem">
            {description}
          </Typography>

          {postImage && (
            <Grow in={!loading} timeout={500}>
              <Grid
                item
                xs={12}
                marginBottom="1rem"
                overflow="hidden"
                borderRadius="0.5rem"
                style={{
                  position: "relative",
                  width: "100%",
                  paddingBottom: "100%",
                }}
              >
                <img
                  src={`data:${postImage.contentType};base64,${postImage.data}`}
                  alt="Post"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Grid>
            </Grow>
          )}

          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            marginBottom="1rem"
          >
            <Grid item>
              <img
                src={likeStatus === "like" ? LikeIcon : LikedIcon}
                alt="Like Icon"
                style={{
                  width: "24px",
                  height: "24px",
                  verticalAlign: "middle",
                  marginRight: "4px",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  transform: likeStatus === "like" ? "scale(1)" : "scale(1.2)",
                }}
                onClick={handleLike}
              />
              {likeCount}
            </Grid>
            <Grid item>
              <img
                src={CommentIcon}
                alt="Comment Icon"
                style={{
                  width: "24px",
                  height: "24px",
                  verticalAlign: "middle",
                  marginRight: "4px",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  transform: "scale(1)",
                }}
                onClick={toggleCommentSection}
              />
            </Grid>
          </Grid>

          {post.location && post.location.length > 0 && (
            <Grid item xs={12} textAlign="right">
              <Typography variant="body3" color="textSecondary">
                Location- <b>{post.location.map((loc) => loc.label).join(", ")}</b>
              </Typography>
            </Grid>
          )}

          {showCommentSection && (
            <CommentSection comments={comments} onAddComment={handleComment} />
          )}
        </>
      )}
    </Grid>
  );
};

export default PostWidget;
