import React from 'react';

interface ErrorAlertProps {
  message: string;
  isQuotaError?: boolean;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message }) => {
  return (
    <div
      className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/30 dark:border-red-600/50 dark:text-red-200 px-4 py-3 rounded-lg relative shadow-md"
      role="alert"
    >
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{message}</span>
    </div>
  );
};

export default ErrorAlert;