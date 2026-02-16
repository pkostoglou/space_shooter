import { useNavigate } from "react-router-dom";
import { createSingleGame, createDoubleGame, joinGame, getAvailableGames } from "../apis";
import { useState } from "react";
import GameSelectionModal from "../components/GameSelectionModal";

export default function ModeSelection() {
  const [games, setGames] = useState<string[]>([])
  const [findGamesModalIsOpen, setFindGamesModalIsOpen] = useState(false)
  const navigate = useNavigate();

  const handleSingleModeSelection = async () => {
    try {
      await createSingleGame()
      navigate('/single')
    } catch (e) {
      console.log(e)
    }
  }

  const handleDoubleModeSelection = async () => {
    try {
      await createDoubleGame()
      navigate('/double')
    } catch (e) {
      console.log(e)
    }
  }

  const handleFetchGames = async () => {
    try {
      const availableGames = await getAvailableGames()
      setGames(availableGames)
      setFindGamesModalIsOpen(true)
    } catch (e) {
      console.log(e)
    }
  }

  const handleJoinGame = async (gameID: string) => {
    try {
      await joinGame(gameID)
      navigate('/double')
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#0a0a1a',
      gap: '16px',
      width: '100%'
    }}>
      <h1 style={{ color: 'white', fontSize: '48px', marginBottom: '32px' }}>
        Space Shooter 🚀
      </h1>

      <button
        onClick={() => handleSingleModeSelection()}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0d7a9a'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1099bb'}
        style={{
          width: '280px',
          padding: '16px',
          fontSize: '18px',
          fontWeight: 'bold',
          color: 'white',
          backgroundColor: '#1099bb',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}
      >
        Single Player
      </button>

      <button
        onClick={() => handleDoubleModeSelection()}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6d28d9'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
        style={{
          width: '280px',
          padding: '16px',
          fontSize: '18px',
          fontWeight: 'bold',
          color: 'white',
          backgroundColor: '#7c3aed',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}
      >
        Create Multiplayer Game
      </button>

      <button
        onClick={() => handleFetchGames()}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6d28d9'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
        style={{
          width: '280px',
          padding: '16px',
          fontSize: '18px',
          fontWeight: 'bold',
          color: 'white',
          backgroundColor: '#7c3aed',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}
      >
        Find Multiplayer Game
      </button>
      <GameSelectionModal isOpen={findGamesModalIsOpen} games={games} onJoinGame={(gameID)=>handleJoinGame(gameID)} />
    </div>
  );
}