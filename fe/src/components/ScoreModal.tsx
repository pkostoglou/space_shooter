import { useState } from 'react';
import { getScores } from '../apis';

const ScoreModal = ({
  isOpen,
  score,
  onSave,
  onRestart
}: {
  isOpen: boolean;
  score: number;
  onSave: (name: string) => void;
  onRestart: () => void;
}) => {
  const [playerName, setPlayerName] = useState('');
  const [currentView, setCurrentView] = useState<"leaderboard" | "actions">('actions')
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [userIsAbleToSave, setUserIsAbleToSave] = useState(true)

  const containerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '900px',
    margin: '0 auto',
    padding: '24px',
  };

  const tableWrapperStyle: React.CSSProperties = {
    overflow: 'auto',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: 'white',
    borderCollapse: 'collapse',
  };

  const theadStyle: React.CSSProperties = {
    background: 'linear-gradient(to right, #3b82f6, #9333ea)',
    color: 'white',
  };

  const thStyle: React.CSSProperties = {
    padding: '16px 24px',
    textAlign: 'left',
    fontWeight: '600',
  };

  const getRowStyle = (index: number): React.CSSProperties => ({
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: 'white',
    transition: 'background-color 0.2s',
  });

  const tdStyle: React.CSSProperties = {
    padding: '16px 24px',
  };

  const getRankStyle = (index: number): React.CSSProperties => ({
    fontWeight: 'bold',
    fontSize: '18px',
    color: index === 0 ? '#eab308' : index === 1 ? '#9ca3af' : index === 2 ? '#ea580c' : '#000',
  });

  const nameStyle: React.CSSProperties = {
    fontWeight: '500',
    color: '#1f2937',
  };

  const scoreStyle: React.CSSProperties = {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    padding: '4px 12px',
    borderRadius: '9999px',
    fontWeight: '600',
    display: 'inline-block',
  };

  const dateStyle: React.CSSProperties = {
    color: '#6b7280',
  };
  if (!isOpen) return null;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userIsAbleToSave) return
    if (playerName.trim()) {
      onSave(playerName.trim());
      setUserIsAbleToSave(false)
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      {currentView == "actions" ? <div style={{
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
          Your score: <strong style={{ color: '#1099bb', fontSize: '20px' }}>{score}</strong>
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
          onClick={onRestart}
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
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead style={theadStyle}>
                <tr>
                  <th style={thStyle}>Rank</th>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Score</th>
                  <th style={thStyle}>Date</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard
                  .sort((a, b) => b.score - a.score)
                  .map((player, index) => (
                    <tr
                      key={index}
                      style={getRowStyle(index)}
                    >
                      <td style={tdStyle}>
                        <span style={getRankStyle(index)}>
                          {index === 0 && '🥇'}
                          {index === 1 && '🥈'}
                          {index === 2 && '🥉'}
                          {index > 2 && `#${index + 1}`}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, ...nameStyle }}>
                        {player.name}
                      </td>
                      <td style={tdStyle}>
                        <span style={scoreStyle}>
                          {player.score.toLocaleString()}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, ...dateStyle }}>
                        {formatDate(player.createdAt)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  );
};

export default ScoreModal;