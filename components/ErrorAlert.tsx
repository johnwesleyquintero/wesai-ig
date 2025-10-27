import React from 'react';

interface ErrorAlertProps {
  message: string;
  isQuotaError: boolean;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, isQuotaError }) => {
  return (
    <div
      className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/30 dark:border-red-600/50 dark:text-red-200 px-4 py-3 rounded-lg relative shadow-md"
      role="alert"
    >
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{message}</span>
      {isQuotaError && (
          <p className="text-sm mt-2">
              For higher rate limits, please check your <a href="https://huggingface.co/settings/billing" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:text-red-800 dark:hover:text-red-100">Hugging Face billing settings</a>.
          </p>
      )}
    </div>
  );
};

export default ErrorAlert;