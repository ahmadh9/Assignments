// src/pages/CourseDetailsPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Rating,
  Card,
  CardContent,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  VideoLibrary as VideoIcon,
  Assignment as AssignmentIcon,
  Quiz as QuizIcon,
  Description as DescriptionIcon,
  Group as GroupIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import courseService from '../services/courseService';
import enrollmentService from '../services/enrollmentService';
import { toast } from 'react-toastify';

const CourseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState({ reviews: [], stats: {} });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await courseService.getCourseById(id);
        setCourse(response.course);
      } catch (err) {
        setError('Failed to load course details');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await courseService.getCourseReviews(id);
        setReviews(response);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };

    fetchData();
    fetchReviews();
  }, [id]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }

    try {
      setEnrolling(true);
      await enrollmentService.enrollInCourse(id);
      toast.success('Successfully enrolled in the course!');
      // Refresh course details to update enrollment status
      const response = await courseService.getCourseById(id);
      setCourse(response.course);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  const handleStartLearning = () => {
    // Navigate to the first lesson of the first module
    if (course.modules && course.modules.length > 0) {
      const firstModule = course.modules[0];
      if (firstModule.lessons && firstModule.lessons.length > 0) {
        navigate(`/courses/${id}/lessons/${firstModule.lessons[0].id}`);
      }
    }
  };

  const getContentIcon = (contentType) => {
    switch (contentType) {
      case 'video':
        return <VideoIcon />;
      case 'assignment':
        return <AssignmentIcon />;
      case 'quiz':
        return <QuizIcon />;
      default:
        return <DescriptionIcon />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !course) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Course not found'}</Alert>
      </Container>
    );
  }

  const thumbnailUrl = course.thumbnail 
    ? `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${course.thumbnail}`
    : 'https://via.placeholder.com/800x400?text=Course';

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Course Header */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              {course.title}
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {course.description}
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <Chip
                icon={<PersonIcon />}
                label={`Instructor: ${course.instructor_name}`}
                variant="outlined"
              />
              {course.category_name && (
                <Chip
                  icon={<SchoolIcon />}
                  label={course.category_name}
                  color="primary"
                  variant="outlined"
                />
              )}
              <Chip
                icon={<GroupIcon />}
                label={`${course.students_count || 0} students`}
                variant="outlined"
              />
            </Box>
            
            {reviews.stats.averageRating > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Rating value={parseFloat(reviews.stats.averageRating)} readOnly precision={0.1} />
                <Typography variant="body2" color="text.secondary">
                  ({reviews.stats.totalReviews} reviews)
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Course Image */}
          <Paper sx={{ mb: 3, overflow: 'hidden' }}>
            <img
              src={thumbnailUrl}
              alt={course.title}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </Paper>

          {/* Course Content */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Course Content
            </Typography>
            
            {course.modules && course.modules.length > 0 ? (
              <List>
                {course.modules.map((module, moduleIndex) => (
                  <Accordion key={module.id} defaultExpanded={moduleIndex === 0}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                          Module {moduleIndex + 1}: {module.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                          {module.lessons?.length || 0} lessons
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      {module.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {module.description}
                        </Typography>
                      )}
                      <List>
                        {module.lessons && module.lessons.map((lesson, lessonIndex) => (
                          <ListItem key={lesson.id}>
                            <ListItemIcon>
                              {getContentIcon(lesson.content_type)}
                            </ListItemIcon>
                            <ListItemText
                              primary={`${lessonIndex + 1}. ${lesson.title}`}
                              secondary={
                                lesson.duration ? `${lesson.duration} minutes` : lesson.content_type
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No content available yet.
              </Typography>
            )}
          </Paper>

          {/* Reviews Section */}
          {reviews.reviews.length > 0 && (
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h5" gutterBottom>
                Student Reviews
              </Typography>
              <List>
                {reviews.reviews.slice(0, 5).map((review) => (
                  <ListItem key={review.id} alignItems="flex-start" divider>
                    <ListItemIcon>
                      <Avatar>{review.user_name?.charAt(0).toUpperCase()}</Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1">{review.user_name}</Typography>
                          <Rating value={review.rating} readOnly size="small" />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {review.comment}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(review.created_at).toLocaleDateString()}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 80 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {course.price ? `${course.price}` : 'Free'}
              </Typography>
              
              {course.isEnrolled ? (
                <>
                  <Alert severity="success" sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon />
                      You are enrolled in this course
                    </Box>
                  </Alert>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleStartLearning}
                  >
                    Continue Learning
                  </Button>
                </>
              ) : (
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleEnroll}
                  disabled={enrolling}
                >
                  {enrolling ? <CircularProgress size={24} /> : 'Enroll Now'}
                </Button>
              )}
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                This course includes:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <VideoIcon />
                  </ListItemIcon>
                  <ListItemText primary={`${course.modules?.length || 0} modules`} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AccessTimeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Lifetime access" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AssignmentIcon />
                  </ListItemIcon>
                  <ListItemText primary="Assignments" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <QuizIcon />
                  </ListItemIcon>
                  <ListItemText primary="Quizzes" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CourseDetailsPage;