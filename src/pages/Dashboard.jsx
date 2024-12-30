import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getForms, deleteForm } from '../utils/api';
import FormCard from '../components/FormCard';
import Header from '../components/Header';
import { GradientCard } from '../components/GradientCard';
import AdSpace from '../components/AdSpace';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadForms = async () => {
    try {
      const data = await getForms();
      setForms(data);
    } catch (error) {
      toast.error('Failed to load forms');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (formId) => {
    try {
      await deleteForm(formId);
      toast.success('Form deleted successfully');
      loadForms();
    } catch (error) {
      toast.error('Failed to delete form');
    }
  };

  useEffect(() => {
    loadForms();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <AdSpace position="top" />
        
        <div className="flex justify-between items-center my-6">
          <h2 className="text-xl font-semibold text-white">Your Forms</h2>
          <Link 
            to="/builder" 
            className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500"
          >
            Create New Form
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : forms.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No forms created yet. Create your first form!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map(form => (
              
                <FormCard 
                key={form._id} 
                form={form} 
                onDelete={() => handleDelete(form._id)} 
              />
              
              
            ))}
          </div>
        )}

        <div className="mt-6">
          <AdSpace position="bottom" />
        </div>
      </div>
    </div>
  );
}
