
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
 import "../App.css";
import App from "@/App";
import TaskCard from "./TaskCard";
  
 const  KanbanBoard=({ id, title, tasks, color, onDrop, onDragEnter })=> {
  const handleDragOver = (e) => {
    e.preventDefault(); // Allow drop event
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const taskData = e.dataTransfer.getData('task');
    const originalStatus = e.dataTransfer.getData('originalStatus');

    if (taskData) {
      const task = JSON.parse(taskData);
      onDrop(task, originalStatus, id);
    }
  };

  return (
    <div className="flex-shrink-0 w-80 bg-gray-50 rounded-lg mr-4">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${color}`} />
            <h3 className="font-semibold">{title}</h3>
            <span className="text-sm text-gray-500">{tasks?.length}</span>
          </div>
          <Button variant="ghost" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div 
            className="space-y-4 min-h-[200px] p-2 rounded-lg transition-colors column-drop-area"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnter={() => onDragEnter(null)}
          >
            {tasks?.map((task) => (
              <TaskCard
                key={task.id} 
                task={task} 
                onDragStart={() => {}} 
                onDragEnter={onDragEnter} 
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

export default KanbanBoard



