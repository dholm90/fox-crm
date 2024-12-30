import React from 'react';
import { TrashIcon, PencilIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export default function FormCard({ form, onDelete }) {
  return (
    <div className="p-4 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 shadow">
      <h3 className="font-bold text-white">{form.title}</h3>
      <p className="text-sm text-gray-200">{form.steps.length} steps</p>
      <div className="flex gap-2 mt-4">
        <Link to={`/builder/${form._id}`} className="p-2 hover:bg-gray-800 rounded text-white">
          <PencilIcon className="w-5 h-5" />
        </Link>
        <Link to={`/preview/${form._id}`} className="p-2 hover:bg-gray-800 rounded text-white">
          <EyeIcon className="w-5 h-5" />
        </Link>
        <button 
          onClick={() => onDelete(form._id)} 
          className="p-2 hover:bg-gray-800 rounded"
        >
          <TrashIcon className="w-5 h-5 text-red-500" />
        </button>
      </div>
    </div>
  );
}
