import axios from "axios";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import TaskItem from "./TaskItem";
import classes from "./TaskList.module.scss";

function TaskList() {
  const [taskList, setTaskList] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [filters, setFilters] = useState({
    completed: "",
    priority: "",
    sortBy: "dueDate",
    order: "asc",
    search: "",
  });

  const getTasks = async () => {
    try {
      const { completed, priority, sortBy, order, search } = filters;
      const query = new URLSearchParams({
        completed,
        priority,
        sortBy,
        order,
        search,
      }).toString();

      const { data } = await axios.get(`/api/tasks/mytasks?${query}`);
      setTaskList(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getTasks();
  }, [filters]);

  const addNewTask = async (e) => {
    e.preventDefault();

    const now = new Date().setHours(0, 0, 0, 0);
  const selectedDueDate = new Date(dueDate).setHours(0, 0, 0, 0);
  const selectedReminderDate = new Date(reminderDate).setHours(0, 0, 0, 0);

  if (newTask.trim().length <= 0) {
    toast.error("Task cannot be empty");
    return;
  }

  if (dueDate && selectedDueDate < now) {
    toast.error("Due date cannot be in the past");
    return;
  }

  if (reminderDate && selectedReminderDate < now) {
    toast.error("Reminder date cannot be in the past");
    return;
  }

    try {
      const { data } = await axios.post("/api/tasks/", {
        title: newTask,
        priority,
        dueDate,
        reminderDate,
      });
      toast.success("New task added");
      setIsAddingNew(false);
      setNewTask("");
      setPriority("medium");
      setDueDate("");
      setReminderDate("");
      setTaskList([data, ...taskList]);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      toast.success("Task deleted");
      setTaskList(taskList.filter((task) => task._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div className={classes.topBar}>
        <input
          type="text"
          placeholder="Search by Task Name..."
          className={classes.search}
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <button className={classes.addNew} onClick={() => setIsAddingNew(true)}>
          Add Task
        </button>
      </div>

      <div className={classes.filters}>
        <select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select
          value={filters.completed}
          onChange={(e) =>
            setFilters({ ...filters, completed: e.target.value })
          }
        >
          <option value="">All Statuses</option>
          <option value="false">Pending</option>
          <option value="true">Completed</option>
        </select>

        <select
          value={filters.order}
          onChange={(e) => setFilters({ ...filters, order: e.target.value })}
        >
          <option value="asc">Due Date (Ascending)</option>
          <option value="desc">Due Date (Descending)</option>
        </select>
      </div>

      {taskList.length > 0 ? (
        <table className={classes.taskList_table}>
          <tbody>
            {taskList.map((task) => (
              <TaskItem key={task._id} task={task} deleteTask={deleteTask} />
            ))}
          </tbody>
        </table>
      ) : (
        "No tasks found"
      )}

      {isAddingNew && (
        <div className={classes.modalOverlay}>
          <div className={classes.modal}>
            <h2>Add New Task</h2>
            <form onSubmit={addNewTask}>
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Task name"
              />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <h2  >Due Date:</h2>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
              <h2  >Reminder Date:</h2>
              <input
                type="date"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
              />
              <h4>You will get reminder by email at 8:00 AM</h4>
              <button type="submit">Add</button>
              <button type="button" onClick={() => setIsAddingNew(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskList;
