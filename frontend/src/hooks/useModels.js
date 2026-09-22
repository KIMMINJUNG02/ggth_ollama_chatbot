import { useEffect, useState } from 'react'
import { getModels } from '../api/chatApi'

export function useModels() {
  const [models, setModels] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false

    async function load() {
      try {
        const data = await getModels()
        if (!ignore) {
          setModels(data)
          setIsLoading(false)
        }
      } catch (err) {
        if (!ignore) {
          setError(err)
          setIsLoading(false)
        }
      }
    }

    load()

    return () => {
      ignore = true
    }
  }, [])

  return { models, isLoading, error }
}
