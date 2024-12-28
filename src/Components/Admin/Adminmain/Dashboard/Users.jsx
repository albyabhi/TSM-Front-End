import React, { useState, useEffect, useCallback } from 'react';
import Sidenav from '../Dashboard/Sidenav';
import Navbar from '../Dashboard/Navbar';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import axios from 'axios';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useNavigate } from 'react-router-dom';

const Users = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);  // New state to handle loading status
  const [error, setError] = useState(null);  // New state to handle error messages
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';  // Default fallback to localhost

  // Effect for checking admin token and redirecting
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/Adminlogin');
    }
  }, [navigate]);

  // Memoized fetchUserData function
  const fetchUserData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users`);
      setUserData(response.data);
      setError(null); // Clear any previous errors
    } catch (error) {
      setError('Error fetching user data.');
      console.error('Error fetching user data:', error.response ? error.response.data.message : error.message);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]); // Add fetchUserData to the dependency array

  // Delete user
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/usersdel/${userId}`);
      console.log(`Delete user with ID: ${userId}`);
      fetchUserData();  // Refresh user data after deletion
    } catch (error) {
      console.error('Error deleting user:', error.response ? error.response.data.message : error.message);
    }
  };

  // Toggle user status between Active/Inactive
  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      await axios.put(`${API_BASE_URL}/api/users/${userId}/status`, { status: newStatus });
      console.log(`User status updated for ID ${userId} to ${newStatus}`);
      fetchUserData();  // Refresh user data after status change
    } catch (error) {
      console.error('Error updating user status:', error.response ? error.response.data.message : error.message);
    }
  };

  return (
    <>
      <Navbar />
      <Box height={30} />
      <Box sx={{ display: 'flex' }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <h1>User Management</h1>
          
          {loading && <CircularProgress />}  {/* Show loading spinner while fetching */}
          {error && <div style={{ color: 'red' }}>{error}</div>}  {/* Show error message */}

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userData?.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <button onClick={() => handleDeleteUser(user._id)}>
                        <DeleteForeverIcon />
                      </button>
                    </TableCell>
                    <TableCell>
                      <button onClick={() => handleStatusToggle(user._id, user.status)}>
                        {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
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

export default Users;
