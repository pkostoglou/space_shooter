import { useState } from 'react';
import { getScores } from '../apis';
import Leaderboard from './Leaderboard';
import Modal from './basics/Modal';

const ScoreModal = ({
  isOpen,
  score,
  onSave,
  onRestart
}: {
  isOpen: boolean;
  score: number;
  onSave: (name: string) => Promise<number | null>;
  onRestart: () => void;
}) => {
  const [playerName, setPlayerName] = useState('');
  const [currentView, setCurrentView] = useState<"leaderboard" | "actions">('actions')
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [userIsAbleToSave, setUserIsAbleToSave] = useState(true)
  const [scoreRank, setScoreRank] = useState<number | null>(null)

  const containerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '900px',
    margin: '0 auto',
    padding: '24px',
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userIsAbleToSave) return
    if (playerName.trim()) {
      const rank = await onSave(playerName.trim());
      setScoreRank(rank)
      setUserIsAbleToSave(false)
    }
  };

  const fetchScores = async () => {
    try {
      const scores = await getScores()
      setLeaderboard(scores)
      console.log(scores)
    } catch (e) {
      console.log(e)
    }
  }

  const getToLeaderboards = async () => {
    await fetchScores()
    setCurrentView("leaderboard")
  }

  return (
    <Modal isOpen={isOpen}>
      {currentView == "actions" ?
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '32px',
          maxWidth: '400px',
          width: '90%',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}>
          <h2 style={{
            margin: '0 0 8px 0',
            fontSize: '28px',
            color: '#333',
            textAlign: 'center',
          }}>
            Game Over!
          </h2>

          <p style={{
            margin: '0 0 24px 0',
            fontSize: '16px',
            color: '#666',
            textAlign: 'center',
          }}>
            Your score: <strong style={{ color: '#1099bb', fontSize: '20px' }}>{score}</strong> {scoreRank && <>Your rank <strong style={{ color: '#1099bb', fontSize: '20px' }}>#{scoreRank}</strong></>}
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={20}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                marginBottom: '16px',
                boxSizing: 'border-box',
                outline: 'none',
              }}
              onFocus={(e) => e.target.style.borderColor = '#1099bb'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
              autoFocus
            />

            <button
              type="submit"
              disabled={!playerName.trim() || !userIsAbleToSave}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                fontWeight: 'bold',
                color: 'white',
                backgroundColor: playerName.trim() ? '#1099bb' : '#ccc',
                border: 'none',
                borderRadius: '8px',
                cursor: playerName.trim() ? 'pointer' : 'not-allowed',
                marginBottom: '12px',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                if (playerName.trim()) {
                  e.currentTarget.style.backgroundColor = '#0d7a9a';
                }
              }}
              onMouseLeave={(e) => {
                if (playerName.trim()) {
                  e.currentTarget.style.backgroundColor = '#1099bb';
                }
              }}
            >
              {userIsAbleToSave ? "Save Score" : "Score Saved!"}
            </button>
          </form>

          <button
            onClick={() => { onRestart(); setScoreRank(null); setUserIsAbleToSave(true) }}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#333',
              backgroundColor: '#f0f0f0',
              border: '2px solid #ddd',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              marginBottom: "12px"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e0e0e0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f0f0';
            }}
          >
            Restart Game
          </button>
          <button
            onClick={() => getToLeaderboards()}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#333',
              backgroundColor: '#f0f0f0',
              border: '2px solid #ddd',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e0e0e0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f0f0';
            }}
          >
            Leaderboards
          </button>
        </div>
        :
        <div style={containerStyle}>
          <button
            onClick={() => setCurrentView("actions")}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'translateX(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'transparent',
              border: '2px solid rgba(255,255,255,0.5)',
              borderRadius: '8px',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              padding: '8px 16px',
              cursor: 'pointer',
              marginBottom: '16px',
              transition: 'all 0.2s ease',
            }}
          >
            ←
          </button>
          <Leaderboard leaderboard={leaderboard} />
        </div>
      }
    </Modal>
  );
};

export default ScoreModal;