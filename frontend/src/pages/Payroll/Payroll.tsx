import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PayrollList from './PayrollList';
import PayrollDetails from './PayrollDetails';

const Payroll: React.FC = () => {
  return (
    <Routes>
      <Route index element={<PayrollList />} />
      <Route path=":id" element={<PayrollDetails />} />
      <Route path="*" element={<Navigate to="/folha-pagamento" replace />} />
    </Routes>
  );
};

export default Payroll;
