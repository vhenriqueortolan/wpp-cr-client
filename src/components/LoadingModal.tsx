import React from 'react';

const LoadingModal = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="flex items-center justify-center flex-col space-y-4">
        <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-white text-lg">Carregando...</p>
      </div>
    </div>
  );
};

export default LoadingModal;
