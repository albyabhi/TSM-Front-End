import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, Typography, CircularProgress } from '@mui/material';
import PostWidget from './Widgets/PostWidget';
import Navbar from './Navbar';

// Styled Typography component for location title


const LocationView = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { locationId } = useParams();
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000'; // Ensure a fallback API URL

  const token = localStorage.getItem('token');

  // Redirect to login if no token exists
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [navigate, token]);

  // Fetch posts for a specific location
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/posts/location/${locationId}`); // Dynamic API URL
        setPosts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false); // Set loading to false if there's an error
      }
    };

    if (locationId) {
      fetchPosts(); // Fetch posts if locationId is available
    }
  }, [locationId, apiUrl]); // Dependencies: locationId and apiUrl

  return (
    <div>
      {/* Render Navbar */}
      <Navbar />
      <div style={{ marginTop: '20px' }}>
        {loading ? ( // Display CircularProgress while loading
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress sx={{ color: 'black' }} />
          </div>
        ) : (
          <Grid container spacing={2} justifyContent="center">
            {posts.length === 0 ? (
              <Typography variant="body1" align="center">No posts found for this location</Typography>
            ) : (
              // Map through the posts array and render PostWidget for each post
              posts.map((post) => (
                <Grid item key={post._id} xs={12} sm={6} md={4} lg={3}>
                  {/* Render the PostWidget component and pass the post data as props */}
                  <PostWidget post={post} />
                </Grid>
              ))
            )}
          </Grid>
        )}
      </div>
    </div>
  );
};

export default LocationView;
