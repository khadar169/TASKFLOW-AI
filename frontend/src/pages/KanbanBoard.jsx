import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd-next';
import { 
  Plus, 
  MoreHorizontal, 
  MessageSquare, 
  Clock, 
  Filter,
  Layout
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState({
    'Pending': { id: 'Pending', tasks: [] },
    'In Progress': { id: 'In Progress', tasks: [] },
    'Completed': { id: 'Completed', tasks: [] }
  });

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
      
      const newColumns = {
        'Pending': { id: 'Pending', tasks: data.filter(t => t.status === 'Pending') },
        'In Progress': { id: 'In Progress', tasks: data.filter(t => t.status === 'In Progress') },
        'Completed': { id: 'Completed', tasks: data.filter(t => t.status === 'Completed') }
      };
      setColumns(newColumns);
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Update locally
    const startCol = columns[source.droppableId];
    const finishCol = columns[destination.droppableId];

    if (startCol === finishCol) {
      const newTasks = Array.from(startCol.tasks);
      const [movedTask] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, movedTask);

      setColumns({
        ...columns,
        [startCol.id]: { ...startCol, tasks: newTasks }
      });
    } else {
      const startTasks = Array.from(startCol.tasks);
      const [movedTask] = startTasks.splice(source.index, 1);
      
      const finishTasks = Array.from(finishCol.tasks);
      finishTasks.splice(destination.index, 0, { ...movedTask, status: destination.droppableId });

      setColumns({
        ...columns,
        [startCol.id]: { ...startCol, tasks: startTasks },
        [finishCol.id]: { ...finishCol, tasks: finishTasks }
      });

      // Update backend
      try {
        await api.put(`/tasks/${draggableId}`, { status: destination.droppableId });
      } catch (err) {
        toast.error('Failed to update task status');
        fetchTasks(); // Rollback
      }
    }
  };

  if (loading) return <div>Loading board...</div>;

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Layout size={24} className="text-primary-500" />
            Workflow Board
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Drag and drop tasks to manage operation stages</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-secondary gap-2 text-xs py-2">
            <Filter size={14} /> Filter
          </button>
          <button className="btn btn-primary gap-2 text-xs py-2">
            <Plus size={14} /> Add Task
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 h-full min-w-[900px]">
            {Object.values(columns).map((column) => (
              <div key={column.id} className="flex-1 flex flex-col min-w-[300px]">
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-700 dark:text-slate-200">{column.id}</h3>
                    <span className="bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      {column.tasks.length}
                    </span>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600">
                    <Plus size={16} />
                  </button>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={cn(
                        "flex-1 rounded-xl p-2 transition-colors",
                        snapshot.isDraggingOver ? "bg-slate-200/50 dark:bg-slate-800/50" : "bg-slate-100/50 dark:bg-dark-card/50"
                      )}
                    >
                      <div className="space-y-3">
                        {column.tasks.map((task, index) => (
                          <Draggable key={task._id} draggableId={task._id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={cn(
                                  "card p-4 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing",
                                  snapshot.isDragging ? "shadow-2xl border-primary-500 rotate-1" : ""
                                )}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <span className={cn(
                                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                                    task.priority === 'High' ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400" :
                                    task.priority === 'Medium' ? "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" :
                                    "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                                  )}>
                                    {task.priority}
                                  </span>
                                  <button className="text-slate-300 hover:text-slate-500">
                                    <MoreHorizontal size={14} />
                                  </button>
                                </div>
                                <h4 className="text-sm font-semibold mb-2">{task.title}</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                                  {task.description}
                                </p>
                                
                                <div className="flex items-center justify-between mt-auto">
                                  <div className="flex items-center gap-3 text-[10px] text-slate-400">
                                    <div className="flex items-center gap-1">
                                      <MessageSquare size={12} />
                                      {task.comments?.length || 0}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock size={12} />
                                      {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </div>
                                  </div>
                                  <img 
                                    src={task.assignedTo?.avatar || `https://ui-avatars.com/api/?name=${task.assignedTo?.name}`} 
                                    alt="" 
                                    className="w-6 h-6 rounded-full border border-slate-200 dark:border-dark-border"
                                  />
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

export default KanbanBoard;
