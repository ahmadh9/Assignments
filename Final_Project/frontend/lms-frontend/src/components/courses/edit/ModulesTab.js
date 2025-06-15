// src/components/courses/edit/ModulesTab.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  VideoLibrary as VideoIcon,
  Description as TextIcon,
  Assignment as AssignmentIcon,
  Quiz as QuizIcon,
} from '@mui/icons-material';
import courseService from '../../../services/courseService';
import { toast } from 'react-toastify';

const ModulesTab = ({ course, onUpdate }) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moduleDialog, setModuleDialog] = useState(false);
  const [lessonDialog, setLessonDialog] = useState(false);
  const [currentModule, setCurrentModule] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content_type: 'video',
    content_url: '',
    duration: 0,
  });

  useEffect(() => {
    fetchModules();
  }, [course.id]);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const response = await courseService.getCourseModules(course.id);
      setModules(response.modules || []);
      
      // Fetch lessons for each module
      for (const module of response.modules || []) {
        const lessonsResponse = await courseService.getModuleLessons(module.id);
        module.lessons = lessonsResponse.lessons || [];
      }
      setModules([...response.modules || []]);
    } catch (err) {
      console.error('Error fetching modules:', err);
      toast.error('Failed to load modules');
    } finally {
      setLoading(false);
    }
  };

  const handleAddModule = () => {
    setCurrentModule(null);
    setFormData({ title: '', description: '' });
    setModuleDialog(true);
  };

  const handleEditModule = (module) => {
    setCurrentModule(module);
    setFormData({ title: module.title, description: module.description });
    setModuleDialog(true);
  };

  const handleSaveModule = async () => {
    try {
      if (currentModule) {
        await courseService.updateModule(currentModule.id, formData);
        toast.success('Module updated successfully');
      } else {
        await courseService.createModule(course.id, formData);
        toast.success('Module created successfully');
      }
      setModuleDialog(false);
      fetchModules();
      if (onUpdate) onUpdate();
    } catch (err) {
      toast.error('Failed to save module');
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (window.confirm('Are you sure you want to delete this module? All lessons will be deleted.')) {
      try {
        await courseService.deleteModule(moduleId);
        toast.success('Module deleted successfully');
        fetchModules();
        if (onUpdate) onUpdate();
      } catch (err) {
        toast.error('Failed to delete module');
      }
    }
  };

  const handleAddLesson = (module) => {
    setCurrentModule(module);
    setCurrentLesson(null);
    setFormData({
      title: '',
      description: '',
      content_type: 'video',
      content_url: '',
      duration: 0,
    });
    setLessonDialog(true);
  };

  const handleEditLesson = (lesson, module) => {
    setCurrentModule(module);
    setCurrentLesson(lesson);
    setFormData({
      title: lesson.title,
      description: lesson.description || '',
      content_type: lesson.content_type,
      content_url: lesson.content_url || '',
      duration: lesson.duration || 0,
    });
    setLessonDialog(true);
  };

  const handleSaveLesson = async () => {
    try {
      if (currentLesson) {
        await courseService.updateLesson(currentLesson.id, formData);
        toast.success('Lesson updated successfully');
      } else {
        await courseService.createLesson(currentModule.id, formData);
        toast.success('Lesson created successfully');
      }
      setLessonDialog(false);
      fetchModules();
    } catch (err) {
      toast.error('Failed to save lesson');
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      try {
        await courseService.deleteLesson(lessonId);
        toast.success('Lesson deleted successfully');
        fetchModules();
      } catch (err) {
        toast.error('Failed to delete lesson');
      }
    }
  };

  const getContentIcon = (type) => {
    switch (type) {
      case 'video': return <VideoIcon />;
      case 'text': return <TextIcon />;
      case 'assignment': return <AssignmentIcon />;
      case 'quiz': return <QuizIcon />;
      default: return <TextIcon />;
    }
  };

  if (loading) {
    return <Typography>Loading modules...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Course Modules</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddModule}
        >
          Add Module
        </Button>
      </Box>

      {modules.length === 0 ? (
        <Alert severity="info">No modules yet. Create your first module to start adding lessons.</Alert>
      ) : (
        modules.map((module, index) => (
          <Accordion key={module.id} defaultExpanded={index === 0}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Typography sx={{ flexGrow: 1 }}>
                  Module {index + 1}: {module.title}
                </Typography>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditModule(module);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteModule(module.id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {module.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {module.description}
                </Typography>
              )}
              
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() => handleAddLesson(module)}
                sx={{ mb: 2 }}
              >
                Add Lesson
              </Button>

              <List>
                {module.lessons?.map((lesson, lessonIndex) => (
                  <ListItem key={lesson.id}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {getContentIcon(lesson.content_type)}
                          <Typography sx={{ ml: 1 }}>
                            {lessonIndex + 1}. {lesson.title}
                          </Typography>
                        </Box>
                      }
                      secondary={lesson.duration ? `${lesson.duration} minutes` : lesson.content_type}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        size="small"
                        onClick={() => handleEditLesson(lesson, module)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteLesson(lesson.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))
      )}

      {/* Module Dialog */}
      <Dialog open={moduleDialog} onClose={() => setModuleDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{currentModule ? 'Edit Module' : 'Add Module'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Module Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Module Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModuleDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveModule} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Lesson Dialog */}
      <Dialog open={lessonDialog} onClose={() => setLessonDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{currentLesson ? 'Edit Lesson' : 'Add Lesson'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Lesson Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Content Type</InputLabel>
            <Select
              value={formData.content_type}
              onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
              label="Content Type"
            >
              <MenuItem value="video">Video</MenuItem>
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="assignment">Assignment</MenuItem>
              <MenuItem value="quiz">Quiz</MenuItem>
            </Select>
          </FormControl>
          
          {/* Video URL - only for video type */}
          {formData.content_type === 'video' && (
            <TextField
              fullWidth
              label="Video URL"
              value={formData.content_url}
              onChange={(e) => setFormData({ ...formData, content_url: e.target.value })}
              margin="normal"
              placeholder="YouTube or Vimeo URL"
            />
          )}
          
          {/* Duration - for video and text */}
          {(formData.content_type === 'video' || formData.content_type === 'text') && (
            <TextField
              fullWidth
              label="Duration (minutes)"
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
              margin="normal"
            />
          )}
          
          {/* Text Content - for text type */}
          {formData.content_type === 'text' && (
            <TextField
              fullWidth
              label="Lesson Content"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={6}
              placeholder="Enter the lesson content here..."
            />
          )}
          
          {/* Assignment Instructions - for assignment type */}
          {formData.content_type === 'assignment' && (
            <>
              <TextField
                fullWidth
                label="Assignment Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Assignment Instructions"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                margin="normal"
                multiline
                rows={4}
                placeholder="Describe what students need to do..."
              />
              <Alert severity="info" sx={{ mt: 2 }}>
                Students will be able to submit their assignments after you create this lesson.
              </Alert>
            </>
          )}
          
          {/* Quiz Info - for quiz type */}
          {formData.content_type === 'quiz' && (
            <>
              <TextField
                fullWidth
                label="Quiz Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Quiz Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                margin="normal"
                multiline
                rows={3}
                placeholder="Brief description of the quiz..."
              />
              <Alert severity="info" sx={{ mt: 2 }}>
                You can add quiz questions after creating this lesson.
              </Alert>
            </>
          )}
          
          {/* Description - only for video and when not other types */}
          {formData.content_type === 'video' && (
            <TextField
              fullWidth
              label="Description (Optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={3}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLessonDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveLesson} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ModulesTab;