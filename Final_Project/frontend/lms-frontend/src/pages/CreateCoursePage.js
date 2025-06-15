// src/pages/CreateCoursePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  FormHelperText,
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import courseService from '../services/courseService';
import api from '../services/api';
import { toast } from 'react-toastify';

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.categories || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      
      const courseData = {
        title: data.title,
        description: data.description,
        category_id: data.category_id || null,
        thumbnail: data.thumbnail || null,
        status: 'pending',  // حالة افتراضية
        is_published: false  // غير منشور افتراضياً
      };

      const response = await courseService.createCourse(courseData);
      toast.success('Course created successfully!');
      navigate(`/courses/${response.course.id}/edit`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create course');
      toast.error('Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create New Course
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            fullWidth
            label="Course Title"
            margin="normal"
            {...register('title', {
              required: 'Course title is required',
              minLength: {
                value: 3,
                message: 'Title must be at least 3 characters',
              },
              maxLength: {
                value: 100,
                message: 'Title must not exceed 100 characters',
              },
            })}
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          <TextField
            fullWidth
            label="Course Description"
            margin="normal"
            multiline
            rows={4}
            {...register('description', {
              required: 'Course description is required',
              minLength: {
                value: 10,
                message: 'Description must be at least 10 characters',
              },
              maxLength: {
                value: 1000,
                message: 'Description must not exceed 1000 characters',
              },
            })}
            error={!!errors.description}
            helperText={errors.description?.message}
          />

          <FormControl fullWidth margin="normal" error={!!errors.category_id}>
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              defaultValue=""
              {...register('category_id')}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            {errors.category_id && (
              <FormHelperText>{errors.category_id.message}</FormHelperText>
            )}
          </FormControl>

          <TextField
            fullWidth
            label="Thumbnail URL (Optional)"
            margin="normal"
            placeholder="https://example.com/image.jpg"
            {...register('thumbnail', {
              pattern: {
                value: /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i,
                message: 'Please enter a valid direct image URL (jpg, jpeg, png, gif, or webp)',
              },
            })}
            error={!!errors.thumbnail}
            helperText={errors.thumbnail?.message || 'Enter a direct image URL (not a page link). You can also upload an image later'}
          />

          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Course'}
            </Button>
          </Box>
        </Box>

        <Alert severity="info" sx={{ mt: 3 }}>
          After creating the course, you'll be able to add modules, lessons, quizzes, and assignments.
        </Alert>
      </Paper>
    </Container>
  );
};

export default CreateCoursePage;