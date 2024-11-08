
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, FileText, MessageCircle, Paperclip, User } from "lucide-react";
import axios from "axios";
import "../App.css"; // Custom styles for drag effects

function TaskCard({ task, onDragStart, onDragEnter }) {
   const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [attachmentCount, setAttachmentCount] = useState(0);

  useEffect(() => {
    fetchAttachmentCount();
  }, [task?.id]);

  


  const fetchAttachmentCount = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/file-count/${task.id}`,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      console.log('data count:', response);
      setAttachmentCount(response.data.fileCount);
    } catch (error) {
      console.error('Error fetching attachment count:', error);
    }
  };
  

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };
  // `http://localhost:5000/upload/${task.id}`,
   const handleFileUpload = async () => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    try {
      const response = await axios.post(
        `http://localhost:5000/upload/${task.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.status) {
        setIsOpen(false);
      }
      setFiles([]); // Clear selected files
      fetchAttachmentCount(); // Refresh attachment count after upload
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("task", JSON.stringify(task));
        e.dataTransfer.setData("originalStatus", task.status);
        e.target.classList.add("dragging");
        onDragStart(task);
      }}
      onDragEnd={(e) => e.target.classList.remove("dragging")}
      onDragEnter={(e) => onDragEnter(task?.id)}
      className="bg-white p-4 rounded-lg shadow-md border cursor-move hover:shadow-lg transition-shadow w-full max-w-xl"
    >
      {/* Top Row - User Info */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>Client</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{task?.clientName || "Client Name"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>SI</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">Sadik Istiak</span>
        </div>
      </div>

      {/* Middle Row - Content */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">{task?.description || "Lorem ipsum dolor sit amet curn..."}</span>
        <span className="text-xs text-gray-400">1/2</span>
      </div>

      {/* Bottom Row - Interactions */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center border-2 border-white">
              <User className="w-3 h-3 text-white" />
            </div>
            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center -ml-2 border-2 border-white">
              <User className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs text-gray-500 ml-1">12+</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>15</span>
          </div>
       
        </div>

        {/* Attachment button and Date */}
        <div className="flex items-center gap-3">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-gray-200 text-black">
                <Paperclip className="h-4 w-4" />
                {attachmentCount}
               </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Attachments</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                <Button onClick={handleFileUpload} className="mt-2">
                  Upload Files
                </Button>
                {files.length > 0 && (
                  <div className="border rounded-lg divide-y mt-4">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 p-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{file?.name}</span>
                        <span className="text-xs text-gray-500">
                          ({file?.name.split(".").pop()})
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          <span>30-12-2022</span>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;



 