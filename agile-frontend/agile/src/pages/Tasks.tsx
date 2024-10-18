import { useEffect, useState } from "react"
import { createTask, deleteTask, fetchTasks, NewTask, toggleComplete, updateTask } from "../services/taskService";
import {
    DndContext,
    closestCenter,
    useSensor,
    useSensors,
    MouseSensor,
    TouchSensor,
    DragEndEvent,
  } from "@dnd-kit/core";
  import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
  } from "@dnd-kit/sortable";
  import { useSortable } from "@dnd-kit/sortable";
  import { CSS } from "@dnd-kit/utilities";
import { toast, Toaster } from "sonner";

  


export interface Task {
    _id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    completed: boolean; 
    dueDate?: string;
}

interface SortableItemProps {
    task: Task;
    handleToggleComplete: (id: string, completed: boolean) => void;
    handleEditTask: (task: Task) => void;
    handleDeleteTask: (id: string, title: string) => void;
  }
  
const Tasks = ({ darkMode }: { darkMode: boolean }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState<NewTask>({
        title: "",
        description: "",
        priority: "low",
    });
    const [editTaskData, setEditTaskData] = useState<Partial<Task> | null>(null);

    useEffect(() => {
        const getTasks = async () => {
            try {
                const data = await fetchTasks();
                setTasks(data);
            } catch(err) {
                console.error("Error teching tasks:",err);
                toast.error("Failed to fetch tasks.");
            }
        };

        getTasks()
    }, []);

    const handleToggleComplete = async (id: string, completed: boolean) => {
        try {
            const updatedTask = await toggleComplete(id, !completed);
            setTasks((prevTasks) =>
            prevTasks.map((task) => 
            task._id === id ? { ...task, completed: updatedTask.completed } : task
        )
    );
    toast.success(`Task marked as ${!completed ? "completed" : "incomplete"}.`);
        } catch(err){
            console.error("Error toggling task completion", err);
            toast.error("Failed to toggle task completion.")
        }
    };

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            const createdTask = await createTask(newTask);
            setTasks((prevTasks) => [...prevTasks, createdTask]);
            setNewTask({title: "", description: "", priority: "low"});
            toast.success("Task created successfully!")
        } catch(err){
            console.error("Error creating task: ", err);
            toast.error("Failed to create task.")
        }
    }

    const handleDeleteTask = async (id: string, title: string) => {
        try {
          await deleteTask(id);
          setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
          toast.success(`${title} task was deleted`)
        } catch (error) {
          console.error("Error deleting task:", error);
          toast.error("Error deleting task.")
        }
      };

      const handleEditTask = (task: Task) => {
        setEditTaskData(task);
      };
    
      const handleUpdateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editTaskData) {
          try {
            const updatedTask = await updateTask(editTaskData._id as string, editTaskData);
            setTasks((prevTasks) =>
              prevTasks.map((task) =>
                task._id === updatedTask._id ? updatedTask : task
              )
            );
            setEditTaskData(null); 
            toast.success("Task updated successfully!")
          } catch (err) {
            console.error("Error updating task: ", err);
            toast.error("Failed to update task.")
          }
        }
      };
    

      const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor)
      );
    
      const handleOnDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
    
        if (active.id !== over?.id) {
          setTasks((prevTasks) => {
            const oldIndex = prevTasks.findIndex((task) => task._id === active.id);
            const newIndex = prevTasks.findIndex((task) => task._id === over?.id);
            return arrayMove(prevTasks, oldIndex, newIndex);
          });
        }
      };

      return (
        <div>
          <h1 className="text-3xl font-bold mb-6">Tasks</h1>

          <Toaster position="top-center"/>
    
          <form onSubmit={handleCreateTask} className="mb-8">
            <div className="flex flex-wrap -mx-2 mb-4">
              <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                <input
                  type="text"
                  placeholder="Task Title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                  required
                />
              </div>
              <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                <input
                  type="text"
                  placeholder="Task Description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                  required
                />
              </div>
              <div className="w-full md:w-1/3 px-2">
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'high' | 'medium' | 'low' })}
                  className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors">
              Add Task
            </button>
          </form>
    
          {editTaskData && (
        <form onSubmit={handleUpdateTask} className="mb-8">
          <input
            type="text"
            placeholder="Task Title"
            value={editTaskData.title ?? ""} // Provide a default value if undefined
            onChange={(e) => setEditTaskData({ ...editTaskData, title: e.target.value })}
            className="border p-2 mr-2"
            required
          />
          <input
            type="text"
            placeholder="Task Description"
            value={editTaskData.description ?? ""} 
            onChange={(e) => setEditTaskData({ ...editTaskData, description: e.target.value })}
            className="border p-2 mr-2"
            required
          />
          <select
            value={editTaskData.priority ?? "low"} 
            onChange={(e) => setEditTaskData({ ...editTaskData, priority: e.target.value as 'high' | 'medium' | 'low' })}
            className="border p-2 mr-2"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button type="submit" className="bg-green-500 text-white p-2">Update Task</button>
        </form>
      )}

<DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleOnDragEnd}
      >
        <SortableContext items={tasks.map((task) => task._id)} strategy={verticalListSortingStrategy}>
          <ul className="space-y-4">
            {tasks.map((task) => (
              <SortableItem
                key={task._id}
                task={task}
                handleToggleComplete={handleToggleComplete}
                handleEditTask={handleEditTask}
                handleDeleteTask={handleDeleteTask}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  )
}


export default Tasks


const SortableItem = ({ task, handleToggleComplete, handleEditTask, handleDeleteTask }: SortableItemProps) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
    } = useSortable({ id: task._id });
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
  
    const priorityColors = {
      low: 'bg-green-200 text-green-800',
      medium: 'bg-yellow-200 text-yellow-800',
      high: 'bg-red-200 text-red-800',
    };
  
    return (
      <li
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={`border rounded-lg shadow-sm p-4 ${task.completed ? 'opacity-50' : ''}`}
      >
        <div {...listeners} className="cursor-move mb-2">
          <h2 className={`text-xl font-semibold ${task.completed ? 'line-through' : ''}`}>
            {task.title}
          </h2>
        </div>
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => handleToggleComplete(task._id, task.completed)}
            className="mr-2"
          />
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
        </div>
        <p className="mb-4">{task.description}</p>
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditTask(task)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded text-sm transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteTask(task._id, task.title)}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-sm transition-colors"
          >
            Delete
          </button>
        </div>
      </li>
    );
  };