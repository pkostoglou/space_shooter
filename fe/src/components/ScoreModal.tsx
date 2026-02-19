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
        <div className="bg-white rounded-xl p-8 max-w-[400px] w-[90%] shadow-md">
          <h2 className="m-0 mb-2 text-[28px] text-[#333] text-center">
            Game Over!
          </h2>

          <p className="mb-6 text-base text-gray-500 text-center">
            Your score: <strong className="text-[#1099bb] text-xl">{score}</strong> {scoreRank && <>Your rank <strong className="text-[#1099bb] text-xl">#{scoreRank}</strong></>}
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={20}
              className="w-full p-3 text-base border-2 border-gray-300 rounded-lg mb-4 outline-none transition-colors focus:border-[#1099bb] text-black"
              autoFocus
            />

            <button
              type="submit"
              disabled={!playerName.trim() || !userIsAbleToSave}
              className={`w-full p-3 text-base font-bold text-white border-none rounded-lg mb-3 transition-colors duration-200 ${
                playerName.trim()
                  ? "bg-[#1099bb] cursor-pointer hover:bg-[#0d7a9a]"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {userIsAbleToSave ? "Save Score" : "Score Saved!"}
            </button>
          </form>

          <button
            onClick={() => { onRestart(); setScoreRank(null); setUserIsAbleToSave(true) }}
            className="w-full p-3 text-base font-bold text-[#333] bg-gray-100 border-2 border-gray-300 rounded-lg cursor-pointer transition-colors duration-200 mb-3 hover:bg-gray-200"
          >
            Restart Game
          </button>
          <button
            onClick={() => getToLeaderboards()}
            className="w-full p-3 text-base font-bold text-[#333] bg-gray-100 border-2 border-gray-300 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-gray-200"
          >
            Leaderboards
          </button>
        </div>
        :
        <div className="w-full max-w-[900px] mx-auto px-6 py-6">
          <button
            onClick={() => setCurrentView("actions")}
            className="flex items-center gap-2 bg-transparent border-2 border-white/50 rounded-lg text-white text-base font-bold px-4 py-2 cursor-pointer mb-4 transition-all duration-200 hover:bg-white/20 hover:-translate-x-1"
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
