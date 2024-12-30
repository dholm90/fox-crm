const API_URL = 'https://multi-step-form-wizard-backend-production.up.railway.app/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Headers with auth token
const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

// Auth API calls
export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  const data = await response.json();
  return data;
};

export const register = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (!response.ok) {
    throw new Error('Registration failed');
  }
  
  const data = await response.json();
  return data;
};

// Forms API calls
export const getForms = async () => {
  const response = await fetch(`${API_URL}/forms`, {
    headers: authHeaders()
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch forms');
  }
  
  return response.json();
};

export const getForm = async (id) => {
  const response = await fetch(`${API_URL}/forms/${id}`, {
    headers: authHeaders()
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch form');
  }
  
  return response.json();
};

export const createForm = async (formData) => {
    try {
      const response = await fetch(`${API_URL}/forms`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create form');
      }
      
      return response.json();
    } catch (error) {
      console.error('Create form error:', error);
      throw error;
    }
  };
  
  export const updateForm = async (id, formData) => {
    try {
      const response = await fetch(`${API_URL}/forms/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update form');
      }
      
      return response.json();
    } catch (error) {
      console.error('Update form error:', error);
      throw error;
    }
  };

export const deleteForm = async (id) => {
  const response = await fetch(`${API_URL}/forms/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete form');
  }
  
  return response.json();
};
