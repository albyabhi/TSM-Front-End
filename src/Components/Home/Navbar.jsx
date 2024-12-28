import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import axios from "axios";
import homeIcon from "./Icons/home.png";
import addpostIcon from "./Icons/addpost.png";
import locationIcon from "./Icons/location.png";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  InputBase,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Tooltip,
  IconButton,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import AddPost from "./Widgets/Addpost";
import { CenteredContainer } from "./Props/CenteredContainer";
import ProfileEdWidget from "./Widgets/ProfileEdWidget"; // Adjust the import path as needed

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: theme.palette.primary.main,
  margin: 0,
  padding: "0 16px",
  [theme.breakpoints.down("sm")]: {
    padding: "0 8px", // Adjust padding for smaller screens
  },
}));

const SearchContainer = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  padding: "0 10px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
}));

const Icons = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: "24px",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    gap: "16px",
  },
}));

const Navbar = () => {
  const [isAddPostVisible, setAddPostVisibility] = useState(false);
  const [isProfileWidgetVisible, setProfileWidgetVisibility] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // State for account menu anchor element
  const [userProfile, setUserProfile] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [username, setUsername] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;
  const isXsOrSm = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const [userResponse, profileResponse] = await Promise.all([
          axios.get(`${apiUrl}/api/profile`, { headers: { Authorization: token } }),
          axios.get(`${apiUrl}/api/profiledata`, { headers: { Authorization: token } }),
        ]);

        const userData = userResponse.data;
        const profileData = profileResponse.data;

        const userProfile = {
          username: userData.username,
          profilePicture: profileData?.profilePicture || null,
        };
        setUsername(userProfile.username);
        setUserProfile(userProfile);
        setProfilePicture(profileData?.profilePicture || null);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    getUser();
  }, [apiUrl]);

  const toggleAddPost = () => {
    setAddPostVisibility((prevVisibility) => !prevVisibility);
  };

  const toggleProfileWidget = () => {
    setProfileWidgetVisibility((prevVisibility) => !prevVisibility);
    setAnchorEl(null);
  };

  const openAccountMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const closeAccountMenu = () => {
    setAnchorEl(null);
  };

  const handleSearchClick = () => {
    navigate("/search");
  };

  const handleLocationClick = () => {
    navigate("/TravelGuideAdd");
  };

  const renderProfilePicture = () => {
    if (profilePicture?.contentType && profilePicture?.data) {
      return `data:${profilePicture.contentType};base64,${profilePicture.data}`;
    }
    return "/path/to/default/profile/picture.png"; // Fallback image
  };

  return (
    <>
      <AppBar position="sticky">
        <StyledToolbar>
          <Link
            to="/home"
            style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center" }}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ display: { xs: "none", sm: "block" } }}>
              NomadGram
            </Typography>
            {isXsOrSm && (
              <img
                src={homeIcon}
                alt="Home"
                style={{
                  width: "24px",
                  height: "24px",
                  marginLeft: "8px",
                  display: "inline-block",
                }}
              />
            )}
          </Link>
          <SearchContainer>
            <InputBase
              placeholder="Search"
              onClick={handleSearchClick}
              endAdornment={
                <IconButton onClick={handleSearchClick}>
                  <SearchIcon />
                </IconButton>
              }
            />
          </SearchContainer>
          <Icons>
            <Tooltip title="Add Post">
              <IconButton onClick={toggleAddPost}>
                <img
                  src={addpostIcon}
                  alt="Add Post"
                  style={{
                    width: "24px",
                    height: "24px",
                    verticalAlign: "middle",
                    marginRight: "4px",
                    cursor: "pointer",
                  }}
                />
              </IconButton>
            </Tooltip>

            <Tooltip title="Add Travel Guide">
              <IconButton aria-label="Location" onClick={handleLocationClick}>
                <img
                  src={locationIcon}
                  alt="Add Travel Guide"
                  style={{
                    width: "24px",
                    height: "24px",
                    verticalAlign: "middle",
                    marginRight: "4px",
                    cursor: "pointer",
                  }}
                />
              </IconButton>
            </Tooltip>

            <IconButton
              aria-controls="account-menu"
              aria-haspopup="true"
              onClick={openAccountMenu}
            >
              <Avatar src={renderProfilePicture()} />
            </IconButton>
            {/* Account menu */}
            <Menu
              id="account-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={closeAccountMenu}
            >
              <MenuItem onClick={toggleProfileWidget}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Icons>
        </StyledToolbar>
      </AppBar>
      {isAddPostVisible && (
        <CenteredContainer>
          <AddPost onClose={toggleAddPost} />
        </CenteredContainer>
      )}
      {isProfileWidgetVisible && (
        <CenteredContainer>
          <ProfileEdWidget onClose={toggleProfileWidget} />
        </CenteredContainer>
      )}
    </>
  );
};

export default Navbar;
