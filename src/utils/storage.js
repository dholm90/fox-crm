export const saveForm = (form) => {
  const forms = getForms()
  const existingIndex = forms.findIndex(f => f.id === form.id)
  
  if (existingIndex >= 0) {
    forms[existingIndex] = form
  } else {
    forms.push(form)
  }
  
  localStorage.setItem('forms', JSON.stringify(forms))
}

export const getForms = () => {
  return JSON.parse(localStorage.getItem('forms') || '[]')
}

export const getForm = (id) => {
  return getForms().find(form => form.id === id)
}

export const deleteForm = (id) => {
  const forms = getForms().filter(form => form.id !== id)
  localStorage.setItem('forms', JSON.stringify(forms))
}
