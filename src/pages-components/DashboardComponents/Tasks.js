import React, { useState, useEffect } from 'react';
import {
  Card,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Chip,
  IconButton,
  makeStyles
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { API_ENDPOINTS } from '../../config/apis';
import apiClient from '../../config/apiClient';
import Textarea from '../Textarea';
import InputSelectNoCreate from '../InputSelectNoCreate';
import Loader from '../Loader';
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
  taskCard: {
    cursor: 'pointer',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[4]
    }
  },
  header: {
    padding: '16px 24px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
  },
  content: {
    padding: '16px'
  },
  footer: {
    padding: '16px 24px',
    borderTop: '1px solid rgba(0, 0, 0, 0.12)'
  },
  chip: {
    margin: theme.spacing(0.5)
  },
  placeholderCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    border: '1px dashed rgba(0, 0, 0, 0.1)',
    height: '100%',
    minHeight: '120px', // Match the approximate height of a task card
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dialogContent: {
    padding: theme.spacing(2),
    '& .MuiTextField-root': {
      margin: theme.spacing(1, 0),
      width: '100%'
    },
    overflowY: 'visible',
    overflowX: 'visible'
  },
  dialogActions: {
    padding: theme.spacing(2),
    paddingTop: '5px'
  },
  dialogPaper: {
    overflowY: 'visible'
  },
  viewDialogTitle: {
    padding: '24px 32px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
    '& h6': {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#2c3e50'
    }
  },
  viewDialogContent: {
    padding: '24px 32px',
    backgroundColor: '#f8f9fa'
  },
  viewDialogActions: {
    padding: '16px 32px',
    borderTop: '1px solid rgba(0, 0, 0, 0.08)',
    backgroundColor: '#ffffff'
  },
  viewDialogSection: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '16px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    '&:last-child': {
      marginBottom: 0
    }
  },
  sectionTitle: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#6c757d',
    marginBottom: '8px'
  },
  sectionContent: {
    color: '#2c3e50',
    fontSize: '1rem'
  },
  viewDialogChip: {
    borderRadius: '6px',
    fontWeight: 500,
    fontSize: '0.875rem'
  },
  timestamp: {
    color: '#6c757d',
    fontSize: '0.875rem'
  },
  viewDialogIconButton: {
    padding: '8px',
    marginLeft: '8px',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)'
    }
  },
  priorityChip: {
    margin: theme.spacing(0.5),
    fontWeight: 500,
    fontSize: '0.75rem',
    height: '24px',
    borderRadius: '12px'
  }
}));

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending':
      return 'default';
    case 'Completed':
      return 'primary';
    case 'In Progress':
      return 'secondary';
    case 'Cancelled':
      return 'error';
    default:
      return 'default';
  }
};

const getPriorityColor = (priority) => {
  const colors = {
    Low: {
      bg: 'rgba(76, 175, 80, 0.1)',
      color: '#2e7d32',
      border: '1px solid rgba(76, 175, 80, 0.2)'
    },
    Medium: {
      bg: 'rgba(255, 152, 0, 0.1)',
      color: '#ed6c02',
      border: '1px solid rgba(255, 152, 0, 0.2)'
    },
    High: {
      bg: 'rgba(244, 67, 54, 0.1)',
      color: '#d32f2f',
      border: '1px solid rgba(244, 67, 54, 0.2)'
    },
    Urgent: {
      bg: 'rgba(211, 47, 47, 0.1)',
      color: '#b71c1c',
      border: '1px solid rgba(211, 47, 47, 0.3)'
    }
  };
  return colors[priority] || colors.Low;
};

const Tasks = () => {
  const classes = useStyles();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openAllDialog, setOpenAllDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [statuses, setStatuses] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    status: '',
    priority: ''
  });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(API_ENDPOINTS.GET_TASKS());
      const tasksData = response.data?.data || [];
      const sortedTasks = tasksData.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
      setTasks(sortedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatuses = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.GET_TASK_STATUS());
      setStatuses(response.data.map(status => ({ value: status, name: status })));
    } catch (error) {
      console.error('Error fetching statuses:', error);
    }
  };

  const fetchPriorities = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.GET_TASK_PRIORITY());
      setPriorities(response.data.map(priority => ({ value: priority, name: priority })));
    } catch (error) {
      console.error('Error fetching priorities:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchStatuses();
    fetchPriorities();
  }, []);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setOpenViewDialog(true);
  };

  const handleEditClick = (e, task) => {
    e.stopPropagation();
    setSelectedTask(task);
    setEditForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority
    });
    setOpenEditDialog(true);
  };

  const handleCreateNew = () => {
    setSelectedTask(null);
    setEditForm({
      title: '',
      description: '',
      status: 'Pending',
      priority: 'Low'
    });
    setOpenEditDialog(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (selectedTask) {
        await apiClient.put(API_ENDPOINTS.PUT_TASK(selectedTask.id), editForm);
        toast.success('Task updated successfully');
      } else {
        await apiClient.post(API_ENDPOINTS.POST_TASK(), editForm);
        toast.success('Task created successfully');
      }
      fetchTasks();
      setOpenEditDialog(false);
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error(selectedTask ? 'Failed to update task' : 'Failed to create task');
    } finally {
      setSaving(false);
    }
  };

  const canEditTask = (status) => {
    return !['Completed', 'Cancelled'].includes(status);
  };

  const handleDeleteClick = (e, task) => {
    e.stopPropagation();
    setTaskToDelete(task);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await apiClient.delete(API_ENDPOINTS.DELETE_TASK(taskToDelete.id));
      toast.success('Task deleted successfully');
      fetchTasks();
      setOpenDeleteDialog(false);
      setTaskToDelete(null);
      // If we're deleting from the view dialog, close it
      if (selectedTask?.id === taskToDelete.id) {
        setOpenViewDialog(false);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    } finally {
      setDeleting(false);
    }
  };

  const TaskCard = ({ task }) => (
    <Card className={classes.taskCard} onClick={() => handleTaskClick(task)}>
      <div className={classes.content}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Typography variant="h6" noWrap style={{ maxWidth: '70%' }}>
            {task.title}
          </Typography>
          <div>
            {canEditTask(task.status) && (
              <IconButton size="small" onClick={(e) => handleEditClick(e, task)}>
                <EditIcon />
              </IconButton>
            )}
            <IconButton 
              size="small" 
              onClick={(e) => handleDeleteClick(e, task)}
              style={{ color: '#f44336' }}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
        <div className="d-flex flex-wrap">
          <Chip
            label={task.status}
            size="small"
            color={getStatusColor(task.status)}
            className={classes.chip}
          />
          <Chip
            label={task.priority}
            size="small"
            className={classes.priorityChip}
            style={{
              backgroundColor: getPriorityColor(task.priority).bg,
              color: getPriorityColor(task.priority).color,
              border: getPriorityColor(task.priority).border
            }}
          />
        </div>
      </div>
    </Card>
  );

  const PlaceholderCard = () => (
    <Card className={classes.placeholderCard}>
      <Typography variant="body2" color="textSecondary">
        
      </Typography>
    </Card>
  );

  const renderTaskCards = () => {
    const currentTasks = tasks.slice(0, 4);
    const placeholdersNeeded = 4 - currentTasks.length;
    
    return (
      <>
        {currentTasks.map((task) => (
          <Grid 
            item 
            xs={12} 
            key={task.id}
          >
            <TaskCard task={task} />
          </Grid>
        ))}
        {[...Array(placeholdersNeeded)].map((_, index) => (
          <Grid 
            item 
            xs={12} 
            key={`placeholder-${index}`}
          >
            <PlaceholderCard />
          </Grid>
        ))}
      </>
    );
  };

  return (
    <>
      <Card className={classes.root}>
        <div className={classes.header}>
          <div className="d-flex align-items-center justify-content-between">
            <Typography variant="h5">Tasks</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleCreateNew}
            >
              Create Task
            </Button>
          </div>
        </div>
        
        <div className={classes.content}>
          {loading ? (
            <div className={classes.loaderContainer}>
              <Loader />
            </div>
          ) : (
            <div className={classes.tasksContainer}>
              <Grid 
                container 
                spacing={2}
                direction="row"
              >
                {tasks && tasks.length > 0 ? (
                  renderTaskCards()
                ) : (
                  <Grid item xs={12} className={classes.emptyState}>
                    <Typography variant="body1" color="textSecondary" align="center">
                      No tasks available. Click "Create Task" to add one.
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </div>
          )}
        </div>

        {tasks && tasks.length > 0 && (
          <div className={classes.footer}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={() => setOpenAllDialog(true)}
            className={classes.actionButton}
          >
            Show All Tasks
          </Button>
        </div>
        )}
      </Card>

      {/* View Task Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="sm"
        fullWidth
        classes={{
          paper: classes.dialogPaper
        }}
      >
        {selectedTask && (
          <>
            <DialogTitle className={classes.viewDialogTitle}>
              <div className="d-flex justify-content-between align-items-center">
                <Typography variant="h6">{selectedTask.title}</Typography>
                <div>
                  {canEditTask(selectedTask.status) && (
                    <IconButton 
                      size="small" 
                      onClick={(e) => handleEditClick(e, selectedTask)}
                      className={classes.viewDialogIconButton}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}
                  <IconButton 
                    size="small" 
                    onClick={(e) => handleDeleteClick(e, selectedTask)}
                    className={classes.viewDialogIconButton}
                    style={{ color: '#dc3545' }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              </div>
            </DialogTitle>
            <DialogContent className={classes.viewDialogContent}>
              <div className={classes.viewDialogSection}>
                <Typography className={classes.sectionTitle}>Status</Typography>
                <div className="d-flex align-items-center">
                  <Chip
                    label={selectedTask.status}
                    color={getStatusColor(selectedTask.status)}
                    className={classes.viewDialogChip}
                  />
                  {!canEditTask(selectedTask.status) && (
                    <Typography variant="caption" color="textSecondary" style={{ marginLeft: '8px' }}>
                      (This task cannot be edited)
                    </Typography>
                  )}
                </div>
              </div>

              <div className={classes.viewDialogSection}>
                <Typography className={classes.sectionTitle}>Priority</Typography>
                <Chip
                  label={selectedTask.priority}
                  className={`${classes.viewDialogChip} ${classes.priorityChip}`}
                  style={{
                    backgroundColor: getPriorityColor(selectedTask.priority).bg,
                    color: getPriorityColor(selectedTask.priority).color,
                    border: getPriorityColor(selectedTask.priority).border,
                    height: '28px',
                    fontSize: '0.875rem'
                  }}
                />
              </div>

              <div className={classes.viewDialogSection}>
                <Typography className={classes.sectionTitle}>Description</Typography>
                <Typography className={classes.sectionContent}>
                  {selectedTask.description || 'No description provided'}
                </Typography>
              </div>

              <div className={classes.viewDialogSection}>
                <Typography className={classes.sectionTitle}>Timestamps</Typography>
                <div className="mb-2">
                  <Typography variant="body2" color="textSecondary">Created:</Typography>
                  <Typography className={classes.timestamp}>
                    {new Date(selectedTask.created_at).toLocaleString()}
                  </Typography>
                </div>
                {selectedTask.completed_at && (
                  <div>
                    <Typography variant="body2" color="textSecondary">Completed:</Typography>
                    <Typography className={classes.timestamp}>
                      {new Date(selectedTask.completed_at).toLocaleString()}
                    </Typography>
                  </div>
                )}
              </div>
            </DialogContent>
            <DialogActions className={classes.viewDialogActions}>
              <Button 
                onClick={() => setOpenViewDialog(false)} 
                color="primary"
                className={classes.actionButton}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* All Tasks Dialog */}
      <Dialog
        open={openAllDialog}
        onClose={() => setOpenAllDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>All Tasks</DialogTitle>
        <DialogContent>
          {loading ? (
            <div style={{ height: '200px', position: 'relative' }}>
              <Loader />
            </div>
          ) : (
            <Grid 
              container 
              spacing={2}
              direction="row"
            >
              {tasks && tasks.length > 0 ? (
                tasks.map((task) => (
                  <Grid 
                    item 
                    xs={12} 
                    key={task.id}
                    style={{ display: 'flex' }}
                  >
                    <div style={{ width: '100%' }}>
                      <TaskCard task={task} />
                    </div>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography variant="body1" color="textSecondary" align="center">
                    No tasks available. Click "Create Task" to add one.
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAllDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit/Create Task Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => !saving && setOpenEditDialog(false)}
        maxWidth="sm"
        fullWidth
        classes={{
          paper: classes.dialogPaper
        }}
        PaperProps={{
          style: { overflowY: 'visible' }
        }}
      >
        <DialogTitle>
          {selectedTask ? 'Edit Task' : 'Create New Task'}
        </DialogTitle>
        <DialogContent className={classes.dialogContent} style={{ paddingLeft: '0px', paddingRight: '35px' }}>
          <div>
            <Textarea
              label="Title"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              maxLength={100}
              disabled={saving}
            />
          </div>
          <div>
            <Textarea
              label="Description"
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              maxLength={300}
              rows={4}
              disabled={saving}
            />
          </div>
          <div>
            <InputSelectNoCreate
              label="Status"
              value={editForm.status}
              onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
              selectItems={statuses}
              disabled={saving}
            />
          </div>
          <div>
            <InputSelectNoCreate
              label="Priority"
              value={editForm.priority}
              onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
              selectItems={priorities}
              disabled={saving}
            />
          </div>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button 
            onClick={() => setOpenEditDialog(false)} 
            color="default"
            disabled={saving}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            color="primary" 
            variant="contained"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => !deleting && setOpenDeleteDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the task "{taskToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setOpenDeleteDialog(false);
              setTaskToDelete(null);
            }} 
            color="primary"
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="secondary"
            variant="contained"
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Tasks;