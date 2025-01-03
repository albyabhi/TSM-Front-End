import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import {
  Avatar,
  Box,
  Typography,
  Container,
  Tab,
  Tabs,
  Paper,
  AppBar,
  Toolbar,
  InputBase,
  IconButton,
  Zoom,
  CircularProgress,
  Slide,
} from "@mui/material";
import axios from "axios";
import { theme } from "./theme";
import { ArrowBack } from "@mui/icons-material";

const SearchAppBar = ({ onSearch, selectedCategory }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [placeholderText, setPlaceholderText] = useState("");

  useEffect(() => {
    // Set placeholder text based on the selected tab
    switch (selectedCategory) {
      case "Users":
        setPlaceholderText("Search Users");
        break;
      case "Locations":
        setPlaceholderText("Search Locations");
        break;
      case "Travel Guides":
        setPlaceholderText("Search Travel Guides");
        break;
      default:
        setPlaceholderText("Search");
        break;
    }
  }, [selectedCategory]);

  const handleSearchChange = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    // Pass the search query to the parent component
    onSearch(query);
  };

  const handleGoBack = () => {
    // Implement navigation to the previous page
    window.history.back();
  };

  return (
    <AppBar position="sticky">
      <Toolbar style={{ display: "flex", justifyContent: "center" }}>
        <IconButton
          onClick={handleGoBack}
          edge="start"
          color="inherit"
          aria-label="back"
        >
          <ArrowBack />
        </IconButton>
        <InputBase
          placeholder={placeholderText}
          value={searchQuery}
          onChange={handleSearchChange}
          style={{
            backgroundColor: theme.palette.secondary.main, // Add your desired background color here
            borderRadius: "4px", // Add border radius
            padding: "8px", // Add padding
            width: "30%",
          }}
        />
      </Toolbar>
    </AppBar>
  );
};

const SearchResultItem = ({ userId, username, profilePicture, onClick }) => {
  return (
    <Slide direction="down" in={true} timeout={500}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        bg="grey.200"
        borderRadius="8px"
        p={2}
        my={2}
        onClick={() => onClick(userId)} // Call onClick function with userId as argument
        style={{ cursor: "pointer" }}
      >
        <Box display="flex" alignItems="center">
          {profilePicture && (
            <Avatar
              alt="Profile"
              src={`data:${profilePicture.contentType};base64,${profilePicture.data}`}
              sx={{
                width: "50px",
                height: "50px",
              }}
            />
          )}
          <Box ml={2}>
            <Typography>{username}</Typography>
          </Box>
        </Box>
      </Box>
    </Slide>
  );
};

const LocationSearchResultItem = ({ locationId, locationName, image, onClick }) => {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    setShow(true);
  }, []);

  return (
    <Slide direction="down" in={show} timeout={500} mountOnEnter unmountOnExit>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        bg="grey.200"
        borderRadius="8px"
        height="60px"
        p={2}
        my={2}
        onClick={() => onClick(locationId)}
        style={{
          cursor: "pointer",
          backgroundImage: image ? `url(data:${image.contentType};base64,${image.data})` : 'none', // Set background image
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: 'white',
            textShadow: '1px 2px 1px black',
            textAlign: 'center', // Center the text
            width: '100%', // Ensure full width
          }}
        >
          {locationName}
        </Typography>
      </Box>
    </Slide>
  );
};

const TravelGuideSearchResultItem = ({
  guideId,
  userId,
  title,
  description,
  image,
  onClick,
  itinerary,
}) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [numDays, setNumDays] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/user/${userId}`
        );
        const userData = response.data;
        setUserName(userData.username);
        setProfilePicture(userData.profilePicture);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchUserData();
  }, [userId]);

  const handleNavigate = () => {
    navigate(`/travelguideView/${guideId}/${userId}`);
  };

  useEffect(() => {
    // Calculate the number of day arrays
    const countDays = () => {
      let count = 0;
      if (itinerary) {
        for (const day in itinerary) {
          if (Array.isArray(itinerary[day])) {
            count++;
          }
        }
      }
      return count;
    };
    setNumDays(countDays());
  }, [itinerary]);

  return (
    <Zoom in={true}>
      <Container
        style={{
          backgroundColor: theme.palette.secondary.main,
          marginTop: "20px",
          borderRadius: "18px",
          padding: "16px",
        }}
      >
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="150px">
            <CircularProgress />
          </Box>
        ) : (
          <div>
            <Box
              display="flex"
              alignItems="center"
              bg="grey.200"
              borderRadius="8px"
              p={2}
              mb={2}
            >
              {profilePicture && (
                <Avatar
                  alt="Profile"
                  src={`data:${profilePicture.contentType};base64,${profilePicture.data}`}
                  sx={{
                    width: "50px",
                    height: "50px",
                    marginRight: "16px",
                    borderRadius: "50%",
                  }}
                />
              )}
              {userName && (
                <Typography variant="subtitle1">{userName}</Typography>
              )}
            </Box>

            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bg="grey.200"
              borderRadius="8px"
              p={2}
              mb={2}
              onClick={handleNavigate}
              style={{
                cursor: "pointer",
                backgroundImage: image
                  ? `url(data:${image.contentType};base64,${image.data})`
                  : "none",
                backgroundSize: "cover",
                height: "150px",
              }}
            >
              <div>
                <Typography
                  variant="h6"
                  style={{ color: "white", textShadow: "1px 2px 1px black" }}
                >
                  <i>{title}</i>
                </Typography>
                <Typography
                  variant="body1"
                  style={{ color: "white", textShadow: "1px 2px 1px black" }}
                >
                  {description}
                </Typography>
                <Typography
                  variant="body1"
                  style={{ color: "white", textShadow: "1px 2px 1px black" }}
                >
                  Days : {numDays}
                </Typography>
              </div>
            </Box>
          </div>
        )}
      </Container>
    </Zoom>
  );
};

const Search = () => {
  const [selectedCategory, setSelectedCategory] = useState("Users");
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate, token]);

  const fetchData = useCallback(async () => {
    try {
      let response;
      if (selectedCategory === "Users") {
        response = await axios.get(`${apiUrl}/api/users/search?username=${searchQuery}`);
      } else if (selectedCategory === "Locations") {
        response = await axios.get(`${apiUrl}/map/locations/search?locationName=${searchQuery}`);
      } else if (selectedCategory === "Travel Guides") {
        response = await axios.get(`${apiUrl}/tg/search?destinationName=${searchQuery}`);
      }
      const searchResultsArray = Array.isArray(response.data)
        ? response.data
        : [response.data];
      setSearchResults(searchResultsArray);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    }
  }, [selectedCategory, searchQuery, apiUrl]);

  useEffect(() => {
    if (searchQuery) {
      fetchData();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, selectedCategory, fetchData]);

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  const handleUserClick = (userId) => {
    navigate(`/profileview/${userId}`);
  };

  const handleLocationClick = (locationId) => {
    navigate(`/LocationView/${locationId}`);
  };

  return (
    <div>
      <SearchAppBar
        onSearch={(query) => setSearchQuery(query)}
        selectedCategory={selectedCategory}
      />

      <Container maxWidth="sm">
        <Box mt={2}>
          <Paper>
            <Tabs
              value={selectedCategory}
              onChange={handleCategoryChange}
              centered
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: theme.palette.secondary.main,
                },
                "& .Mui-selected": {
                  backgroundColor: theme.palette.secondary.main,
                },
              }}
            >
              <Tab label="Users" value="Users" />
              <Tab label="Travel Guides" value="Travel Guides" />
              <Tab label="Locations" value="Locations" />
            </Tabs>
          </Paper>

          {selectedCategory === "Users" &&
            searchResults.map((item) => (
              <SearchResultItem
                key={item.userId}
                userId={item.userId}
                username={item.username}
                profilePicture={item.profilePicture}
                onClick={handleUserClick}
              />
            ))}

          {searchQuery &&
            selectedCategory === "Locations" &&
            searchResults.map((item) => (
              <LocationSearchResultItem
                key={item._id}
                locationId={item._id}
                image={item.image}
                locationName={item.name}
                onClick={handleLocationClick}
              />
            ))}

          {selectedCategory === "Travel Guides" &&
            searchResults.map((guide) => (
              <TravelGuideSearchResultItem
                key={guide._id}
                userId={guide.userId}
                guideId={guide._id}
                title={guide.featureDestination ? guide.featureDestination.name : " "}
                description={guide.featureDestination ? guide.featureDestination.description : ""}
                image={guide.featureDestination ? guide.featureDestination.image : null}
                itinerary={guide.itinerary}
              />
            ))}
        </Box>
      </Container>
    </div>
  );
};

export default Search;
