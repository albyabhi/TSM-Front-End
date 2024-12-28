import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import axios from 'axios';

export const LocationAddform = ({ fetchLocations }) => {
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [typomsg, setTypoMsg] = useState("Didn't find the location you are looking for? Add it");
  const [selectedNation, setSelectedNation] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [nations, setNations] = useState([]);
  const [states, setStates] = useState([]);
  const [location, setLocation] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000'; // Using fallback API URL if not set in env

  const [alertMessage, setAlertMessage] = useState("");

  // Fetch nations on component mount
  useEffect(() => {
    const fetchNations = async () => {
      try {
        const response = await axios.get(`${apiUrl}/map/fetchnations`); // Using dynamic API URL
        setNations(response.data);
        console.log("Fetched Nations:", response.data);
      } catch (error) {
        console.error("Error fetching nations:", error.response ? error.response.data.message : error.message);
      }
    };

    fetchNations();
    fetchLocations(); // Ensures that the locations are also fetched on mount
  }, [apiUrl, fetchLocations]); // Dependencies: apiUrl and fetchLocations to ensure proper re-fetch

  // Fetch states when a nation is selected
  const fetchStates = async (nationId) => {
    try {
      const response = await axios.get(`${apiUrl}/map/fetchstates?nation=${nationId}`); // Using dynamic API URL
      setStates(response.data);
      console.log("Fetched States:", response.data);
    } catch (error) {
      console.error("Error fetching states:", error.response ? error.response.data.message : error.message);
    }
  };

  const handleNationChange = async (nationId) => {
    setSelectedNation(nationId);
    fetchStates(nationId);
    await fetchLocations(); // Re-fetch locations when nation changes
  };

  // Handle adding a new location
  const handleAddLocation = async () => {
    if (!selectedNation || selectedNation === "defaultNation") {
      setAlertMessage("Please select a nation before choosing a state.");
      return;
    }

    if (!selectedState || selectedState === "defaultState") {
      setAlertMessage("Please select a state before adding a location.");
      return;
    }

    try {
      await axios.post(`${apiUrl}/map/locations`, { // Using dynamic API URL
        nationid: selectedNation,
        stateid: selectedState,
        locationName: location,
      });

      setAlertMessage("Location added successfully.");
      setSelectedNation("defaultNation");
      setSelectedState("defaultState");
      setLocation("");
      setTypoMsg("New location added");
      setShowAddLocation(false);
      await fetchLocations(); // Re-fetch locations after adding new one
    } catch (error) {
      console.error('Error adding location:', error.response?.data?.message);
      setAlertMessage("Error adding location. Please try again.");
    }
  };

  // Handle clicking to show the add location form
  const handleAddLocationClick = () => {
    setShowAddLocation(true);
  };

  // Handle canceling the add location form
  const handleAddLocationCancel = () => {
    setShowAddLocation(false);
  };

  useEffect(() => {
    if (!showAddLocation) {
      setAlertMessage("New location added");
    }
  }, [showAddLocation]); // Show alert message when add location form is toggled

  return (
    <div>
      {!showAddLocation && (
        <Typography
          onClick={handleAddLocationClick}
          style={{ cursor: "pointer", color: "blue" }}
        >
          {typomsg}
        </Typography>
      )}

      {showAddLocation && (
        <>
          <InputLabel>Country</InputLabel>
          <div>
            <Select
              value={selectedNation}
              onChange={(e) => handleNationChange(e.target.value)}
              fullWidth
              margin="normal"
            >
              <MenuItem value="defaultNation">Select a nation</MenuItem>
              {nations.map((nation) => (
                <MenuItem key={nation._id} value={nation._id}>
                  {nation.name}
                </MenuItem>
              ))}
            </Select>
          </div>

          {selectedNation && (
            <>
              <InputLabel>State</InputLabel>
              <div>
                <Select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  fullWidth
                  margin="normal"
                >
                  <MenuItem value="defaultState">Select a state</MenuItem>
                  {states.map((state) => (
                    <MenuItem key={state._id} value={state._id}>
                      {state.name}
                    </MenuItem>
                  ))}
                </Select>
              </div>

              <InputLabel>Enter location new name</InputLabel>
              <TextField
                fullWidth
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />

              <Button
                variant="contained"
                color="primary"
                onClick={handleAddLocation}
              >
                Add Location
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleAddLocationCancel}
              >
                Cancel
              </Button>
            </>
          )}

          {alertMessage && (
            <Typography color={alertMessage.includes("Error") ? "error" : "primary"}>{alertMessage}</Typography>
          )}
        </>
      )}
    </div>
  );
};
