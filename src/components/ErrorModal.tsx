"use client";
import { motion, AnimatePresence } from "framer-motion";
import { XCircle } from "lucide-react";

const ErrorModal = () => {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center space-y-4"
        >
          <XCircle size={80} className="text-red-500" />
          <p className="text-lg font-semibold text-red-600">Ocorreu um erro!</p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ErrorModal;
