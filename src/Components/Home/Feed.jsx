import React, { useState, useEffect, useCallback } from 'react';
import { Box, CircularProgress, IconButton, Tooltip, Typography } from '@mui/material';
import PostWidget from './Widgets/PostWidget';
import axios from 'axios';
import refreshIcon from './Icons/refresh.png';

const Feed = ({ onRefreshUser }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rotation, setRotation] = useState(0);
  const apiUrl = process.env.REACT_APP_API_URL; // Fallback API URL if not defined in env

  // Function to fetch posts, wrapped with useCallback to avoid unnecessary re-creations
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/posts/all`); // Using dynamic API URL
      if (response.data && response.data.length > 0) {
        setPosts(response.data.reverse());
        console.log('Fetched Posts:', response.data);
      } else {
        console.log('No posts available');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]); // Only re-create fetchPosts when apiUrl changes

  // Handle refresh button click
  const handleClick = () => {
    setRotation(rotation + -560); // Rotate the icon on click
    setTimeout(fetchPosts, 500); // Fetch posts after rotation animation
  };

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]); // Now the warning should be resolved

  return (
    <Box flex={4} padding={2}>
      <Box mb={2} textAlign="center">
        <Tooltip title="Refresh Feed">
          <IconButton onClick={handleClick}>
            <img
              src={refreshIcon}
              alt="Refresh Icon"
              style={{
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                transition: 'transform 1.0s ease-in-out',
                transform: `rotate(${rotation}deg)`, // Apply rotation on click
              }}
            />
          </IconButton>
        </Tooltip>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress
            style={{
              color: 'black',
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            size={40}
          />
        </Box>
      ) : posts.length > 0 ? (
        posts.map((post) => <PostWidget key={post._id} post={post} />) // Display posts
      ) : (
        <Typography variant="body1" style={{ textAlign: 'center' }}>
          No posts available
        </Typography>
      )}
    </Box>
  );
};

export default Feed;
