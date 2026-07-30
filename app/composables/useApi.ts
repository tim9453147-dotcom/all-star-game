export const useApi = () => {
  const fetchPlayers = () => useFetch('/api/players')
  const applyPlayer = (data: { player_id: string, name: string }) => 
    $fetch('/api/players/apply', { method: 'POST', body: data })
  return { fetchPlayers, applyPlayer }
}
