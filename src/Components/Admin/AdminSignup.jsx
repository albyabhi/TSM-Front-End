import React, { useState } from 'react';
import axios from 'axios';
import { Button, Container, CssBaseline, Grid, InputLabel, Paper, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AdminSignup = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState({
    adminEmail: '',
    adminId: '',
    adminPassword: '',
  });

  // Fetch the base URL from environment variables
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const handleInputChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/signup`, adminData);
      console.log('Response:', response.data);

      if (response.data.message === 'Admin registered successfully.') {
        navigate('/adminlogin');
      }
    } catch (error) {
      console.error('Admin registration failed:', error.response ? error.response.data.message : error.message);
    }
  };

  const handleLoginNavigate = () => {
    navigate('/adminlogin');
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <CssBaseline />
      <Paper elevation={3} style={{ padding: '20px', backgroundColor: '#ADD2C9' }}>
        <Typography variant="h5" component="div" gutterBottom>
          NomadGram Admin Registration
        </Typography>
        <form style={{ width: '100%', marginTop: '8px' }} onSubmit={handleFormSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <InputLabel>Email</InputLabel>
              <TextField
                fullWidth
                type="email"
                name="adminEmail"
                onChange={handleInputChange}
                variant="outlined"
                value={adminData.adminEmail}
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel>Admin Id</InputLabel>
              <TextField
                fullWidth
                type="text"
                name="adminId"
                onChange={handleInputChange}
                variant="outlined"
                value={adminData.adminId}
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel>Password</InputLabel>
              <TextField
                fullWidth
                type="password"
                name="adminPassword"
                onChange={handleInputChange}
                variant="outlined"
                value={adminData.adminPassword}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: '16px', alignSelf: 'flex-end' }}
          >
            Register Admin
          </Button>
          <Grid container justifyContent="center">
            <Typography
              variant="body2"
              onClick={handleLoginNavigate}
              style={{ cursor: 'pointer', marginTop: '8px' }}
            >
              Already Registered? Login
            </Typography>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AdminSignup;
