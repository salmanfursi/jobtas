import { useState } from "react";
import KanbanBoard from "./component/KanbanBoard";
import cardData from "./assets/card.json";

const App = () => {
  const [tasks, setTasks] = useState(cardData);

  const [dragOverTaskId, setDragOverTaskId] = useState(null);

  const handleDrop = (task, originalStatus, newStatus) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.filter((t) => t.id !== task.id);
      const newIndex = dragOverTaskId
        ? updatedTasks.findIndex((t) => t.id === dragOverTaskId)
        : updatedTasks.length;

      const finalTasks = [
        ...updatedTasks.slice(
          0,
          newIndex === -1 ? updatedTasks.length : newIndex
        ),
        { ...task, status: newStatus },
        ...updatedTasks.slice(newIndex === -1 ? updatedTasks.length : newIndex),
      ];
      setDragOverTaskId(null);
      return finalTasks;
    });
  };

  const handleDragEnter = (taskId) => {
    setDragOverTaskId(taskId);
  };

  const columns = [
    {
      id: "incomplete",
      title: "Incomplete",
      color: "bg-red-500",
    },
    {
      id: "todo",
      title: "To Do",
      color: "bg-blue-500",
    },
    {
      id: "doing",
      title: "Doing",
      color: "bg-yellow-500",
    },
    {
      id: "review",
      title: "Under Review",
      color: "bg-purple-500",
    },
    {
      id: "completed",
      title: "Completed",
      color: "bg-green-500",
    },
    {
      id: "overdue",
      title: "Overdue",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="p-6">
      <div className="flex overflow-x-auto pb-6">
        {columns.map((column) => (
          <KanbanBoard
            key={column.id}
            id={column.id}
            title={column.title}
            tasks={tasks.filter((t) => t.status === column.id)}
            color={column.color}
            onDrop={handleDrop}
            onDragEnter={handleDragEnter}
          />
        ))}
      </div>
    </div>
  );
};

export default App;






