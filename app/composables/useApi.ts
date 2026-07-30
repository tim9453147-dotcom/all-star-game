export const useApi = () => {
  const fetchPlayers = () => useFetch('/api/players')
  const fetchRewards = () => useFetch('/api/rewards')
  const applyPlayer = (data: { player_id: string, name: string }) => 
    $fetch('/api/players/apply', { method: 'POST', body: data })
  return { fetchPlayers, fetchRewards, applyPlayer }
}
