import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TasksList from './TasksList';
import TaskForm from './TaskForm';

const Tasks: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route index element={<TasksList />} />
        <Route path="nova" element={<TaskForm />} />
        <Route path=":id/editar" element={<TaskForm />} />
        <Route path="*" element={<Navigate to="/tarefas" replace />} />
      </Routes>
    </div>
  );
};

export default Tasks;
