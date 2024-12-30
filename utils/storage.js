export const loadForms = () => {
  if (typeof window === 'undefined') return []
  const forms = localStorage.getItem('forms')
  return forms ? JSON.parse(forms) : []
}

export const saveForm = (form) => {
  const forms = loadForms()
  const existingFormIndex = forms.findIndex(f => f.id === form.id)
  
  if (existingFormIndex >= 0) {
    forms[existingFormIndex] = form
  } else {
    forms.push(form)
  }
  
  localStorage.setItem('forms', JSON.stringify(forms))
}

export const deleteForms = (id) => {
  const forms = loadForms()
  const newForms = forms.filter(form => form.id !== id)
  localStorage.setItem('forms', JSON.stringify(newForms))
}
