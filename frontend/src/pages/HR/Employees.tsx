import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import EmployeeList from './EmployeeList';
import EmployeeForm from './EmployeeForm';

const Employees: React.FC = () => {
  return (
    <Routes>
      <Route index element={<EmployeeList />} />
      <Route path="novo" element={<EmployeeForm />} />
      <Route path=":id" element={<EmployeeForm />} />
      <Route path=":id/editar" element={<EmployeeForm />} />
      <Route path="*" element={<Navigate to="/funcionarios" replace />} />
    </Routes>
  );
};

export default Employees;

