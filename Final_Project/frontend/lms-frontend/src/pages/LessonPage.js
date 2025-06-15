// src/pages/LessonPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  VideoLibrary as VideoIcon,
  Description as TextIcon,
  Assignment as AssignmentIcon,
  Quiz as QuizIcon,
} from '@mui/icons-material';
import courseService from '../services/courseService';
import { toast } from 'react-toastify';

const LessonPage = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [error, setError] = useState('');
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    const loadLessonData = async () => {
      try {
        setLoading(true);
        // Fetch lesson details
        const lessonResponse = await courseService.getLessonById(lessonId);
        setLesson(lessonResponse.lesson);
        
        // Fetch course details for navigation
        const courseResponse = await courseService.getCourseById(courseId);
        setCourse(courseResponse.course);
      } catch (err) {
        setError('Failed to load lesson');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadLessonData();
  }, [lessonId, courseId]);

  const handleCompleteLesson = async () => {
    try {
      setCompleting(true);
      await courseService.markLessonComplete(lessonId);
      toast.success('Lesson marked as complete!');
      // Navigate to next lesson if available
      navigateToNextLesson();
    } catch (err) {
      toast.error('Failed to mark lesson as complete');
    } finally {
      setCompleting(false);
    }
  };

  const navigateToNextLesson = () => {
    if (!course || !course.modules) return;
    
    // Find current lesson and get next one
    for (const module of course.modules) {
      const lessonIndex = module.lessons?.findIndex(l => l.id === parseInt(lessonId));
      if (lessonIndex !== -1 && lessonIndex < module.lessons.length - 1) {
        // Next lesson in same module
        const nextLesson = module.lessons[lessonIndex + 1];
        navigate(`/courses/${courseId}/lessons/${nextLesson.id}`);
        return;
      } else if (lessonIndex === module.lessons.length - 1) {
        // Last lesson in module, check next module
        const moduleIndex = course.modules.findIndex(m => m.id === module.id);
        if (moduleIndex < course.modules.length - 1) {
          const nextModule = course.modules[moduleIndex + 1];
          if (nextModule.lessons && nextModule.lessons.length > 0) {
            navigate(`/courses/${courseId}/lessons/${nextModule.lessons[0].id}`);
            return;
          }
        }
      }
    }
    
    // No more lessons
    toast.info('You have completed all lessons!');
    navigate(`/courses/${courseId}`);
  };

  const renderLessonContent = () => {
    if (!lesson) return null;

    switch (lesson.content_type) {
      case 'video':
        return (
          <Box sx={{ position: 'relative', paddingTop: '56.25%', mb: 3 }}>
            <iframe
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
              src={lesson.content_url}
              title={lesson.title}
              frameBorder="0"
              allowFullScreen
            />
          </Box>
        );
      
      case 'text':
        return (
          <Paper sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {lesson.description || 'No content available'}
            </Typography>
          </Paper>
        );
      
      case 'assignment':
        return (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body1">
              This is an assignment lesson. Please check the assignments section for details.
            </Typography>
          </Alert>
        );
      
      case 'quiz':
        return (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body1">
              This lesson contains a quiz. Click the button below to start.
            </Typography>
            <Button variant="contained" sx={{ mt: 2 }}>
              Start Quiz
            </Button>
          </Alert>
        );
      
      default:
        return (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Content type not supported
          </Alert>
        );
    }
  };

  const getLessonIcon = (contentType) => {
    switch (contentType) {
      case 'video':
        return <VideoIcon />;
      case 'text':
        return <TextIcon />;
      case 'assignment':
        return <AssignmentIcon />;
      case 'quiz':
        return <QuizIcon />;
      default:
        return <TextIcon />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !lesson) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Lesson not found'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          component="button"
          variant="body1"
          onClick={() => navigate('/courses')}
          underline="hover"
          color="inherit"
        >
          Courses
        </Link>
        <Link
          component="button"
          variant="body1"
          onClick={() => navigate(`/courses/${courseId}`)}
          underline="hover"
          color="inherit"
        >
          {course?.title || 'Course'}
        </Link>
        <Typography color="text.primary">{lesson.title}</Typography>
      </Breadcrumbs>

      <Paper sx={{ p: 4 }}>
        {/* Lesson Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          {getLessonIcon(lesson.content_type)}
          <Typography variant="h4" sx={{ ml: 2 }}>
            {lesson.title}
          </Typography>
        </Box>

        {lesson.description && (
          <>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {lesson.description}
            </Typography>
            <Divider sx={{ mb: 3 }} />
          </>
        )}

        {/* Lesson Content */}
        {renderLessonContent()}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(`/courses/${courseId}`)}
          >
            Back to Course
          </Button>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={handleCompleteLesson}
              disabled={completing}
            >
              {completing ? <CircularProgress size={24} /> : 'Mark as Complete'}
            </Button>
            
            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              onClick={navigateToNextLesson}
            >
              Next Lesson
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LessonPage;