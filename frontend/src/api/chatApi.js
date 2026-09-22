import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8100',
})

export async function getModels() {
  const res = await api.get('/models')
  return res.data.models
}

export async function sendChat(payload) {
  const res = await api.post('/chat', payload)
  return res.data
}
