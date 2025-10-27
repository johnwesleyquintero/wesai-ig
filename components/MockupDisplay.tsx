import React from 'react';
import { DownloadIcon } from './Icons';

interface MockupDisplayProps {
  mockupSrc: string;
}

const MockupDisplay: React.FC<MockupDisplayProps> = ({ mockupSrc }) => {
    
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 border-b-2 border-gray-200 dark:border-gray-700 pb-2">A+ Content Mockup</h2>
      <div className="bg-gray-200 dark:bg-gray-700 p-4 sm:p-6 rounded-lg shadow-xl inline-block">
        <div className="bg-white p-2 rounded-md">
            <img
                src={mockupSrc}
                alt="A+ Content Mockup"
                className="max-w-full h-auto"
            />
        </div>
      </div>
      <div className="mt-6">
        <a
          href={mockupSrc}
          download={`a-plus-mockup-${Date.now()}.jpeg`}
          className="inline-flex items-center justify-center px-8 py-3 font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-md hover:from-purple-700 hover:to-pink-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
        >
          <DownloadIcon />
          Download Mockup
        </a>
      </div>
    </div>
  );
};

export default MockupDisplay;