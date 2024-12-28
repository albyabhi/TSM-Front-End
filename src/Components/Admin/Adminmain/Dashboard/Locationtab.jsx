import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Alert,
  AlertTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Sidenav from "../Dashboard/Sidenav";
import Navbar from "../Dashboard/Navbar";
import axios from "axios";

const Locationtab = () => {
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const [nations, setNations] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedNation, setSelectedNation] = useState("defaultNation");
  const [selectedState, setSelectedState] = useState("defaultState");
  const [alertMessage, setAlertMessage] = useState("");
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState([]);

  const fetchLocations = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/map/allfetchlocations`);
      setLocations(response.data);
    } catch (error) {
      console.error("Error fetching locations:", error.message);
      setAlertMessage("Failed to fetch locations.");
    }
  };

  useEffect(() => {
    const fetchNations = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/map/fetchnations`);
        setNations(response.data);
      } catch (error) {
        console.error("Error fetching nations:", error.message);
        setAlertMessage("Failed to fetch nations.");
      }
    };

    fetchNations();
    fetchLocations(); // Fetch locations on component mount
  }, [API_BASE_URL]);

  const fetchStates = async (nationId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/map/fetchstates?nation=${nationId}`
      );
      setStates(response.data);
    } catch (error) {
      console.error("Error fetching states:", error.message);
      setAlertMessage("Failed to fetch states.");
    }
  };

  const handleNationChange = async (nationId) => {
    setSelectedNation(nationId);
    await fetchStates(nationId);
    await fetchLocations();
  };

  const handleAddLocation = async () => {
    if (!selectedNation || selectedNation === "defaultNation") {
      setAlertMessage("Please select a nation.");
      return;
    }
    if (!selectedState || selectedState === "defaultState") {
      setAlertMessage("Please select a state.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/map/locations`, {
        nationid: selectedNation,
        stateid: selectedState,
        locationName: location,
      });
      setLocation("");
      setAlertMessage("Location added successfully.");
      await fetchLocations();
    } catch (error) {
      console.error("Error adding location:", error.message);
      setAlertMessage("Failed to add location.");
    }
  };

  const handleDeleteLocation = async (locationId) => {
    try {
      await axios.delete(`${API_BASE_URL}/map/locations/${locationId}`);
      setLocations((prevLocations) =>
        prevLocations.filter((loc) => loc._id !== locationId)
      );
      setAlertMessage("Location deleted successfully.");
    } catch (error) {
      console.error("Error deleting location:", error.message);
      setAlertMessage("Failed to delete location.");
    }
  };

  const handleImageUpload = async (locationId, file) => {
    const formData = new FormData();
    formData.append("locationImage", file);

    try {
      await axios.post(`${API_BASE_URL}/map/locations/${locationId}/upload-image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAlertMessage("Image uploaded successfully.");
      await fetchLocations();
    } catch (error) {
      console.error("Error uploading image:", error.message);
      setAlertMessage("Failed to upload image.");
    }
  };

  return (
    <>
      <Navbar />
      <Box height={30} />
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {alertMessage && (
            <Alert severity="info">
              <AlertTitle>Info</AlertTitle>
              {alertMessage}
            </Alert>
          )}

          <InputLabel>Nation</InputLabel>
          <Select
            value={selectedNation}
            onChange={(e) => handleNationChange(e.target.value)}
          >
            <MenuItem value="defaultNation">Select a nation</MenuItem>
            {nations.map((nation) => (
              <MenuItem key={nation._id} value={nation._id}>
                {nation.name}
              </MenuItem>
            ))}
          </Select>

          <InputLabel>State</InputLabel>
          <Select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            <MenuItem value="defaultState">Select a state</MenuItem>
            {states.map((state) => (
              <MenuItem key={state._id} value={state._id}>
                {state.name}
              </MenuItem>
            ))}
          </Select>

          <InputLabel>Location Name</InputLabel>
          <TextField
            fullWidth
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <Button variant="contained" onClick={handleAddLocation}>
            Add Location
          </Button>

          <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Location</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {locations.map((loc) => (
                  <TableRow key={loc._id}>
                    <TableCell>{loc.name}</TableCell>
                    <TableCell>
                      {loc.image ? (
                        <img
                          src={`data:${loc.image.contentType};base64,${loc.image.data}`}
                          alt={loc.name}
                          style={{ width: "100px" }}
                        />
                      ) : (
                        "No Image"
                      )}
                      <input
                        type="file"
                        onChange={(e) =>
                          handleImageUpload(loc._id, e.target.files[0])
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => handleDeleteLocation(loc._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
};

export default Locationtab;
