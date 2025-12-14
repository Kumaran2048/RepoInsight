import axios from 'axios'

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Analysis API
export const analysisAPI = {
  analyzeRepository: (repoUrl) => 
    api.post('/analyze', { repositoryUrl: repoUrl }),
  
  getAnalyses: () => 
    api.get('/analyses'),
  
  getAnalysis: (id) => 
    api.get(`/analyses/${id}`),
  
  compareRepositories: (repo1, repo2) => 
    api.post('/compare', { repo1, repo2 }),
  
  exportPDF: (id) => 
    api.get(`/export/pdf/${id}`, { responseType: 'blob' }),
}

// User API
export const userAPI = {
  getProfile: () => 
    api.get('/user/profile'),
  
  updateProfile: (profileData) => 
    api.put('/user/profile', profileData),
  
  getDashboard: () => 
    api.get('/dashboard'),
}

export default api