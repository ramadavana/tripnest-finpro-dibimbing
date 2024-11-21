// components/Loading.js
import React from "react";

const Loading = ({ message = "Loading...", size = "50px" }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="loader" style={{ width: size, height: size }}>
        <div className="spinner"></div>
      </div>
      <p className="ml-4 text-lg">{message}</p>
      <style jsx>{`
        .loader {
          display: inline-block;
          position: relative;
        }
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-left-color: #000;
          border-radius: 50%;
          width: 100%;
          height: 100%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Loading;
