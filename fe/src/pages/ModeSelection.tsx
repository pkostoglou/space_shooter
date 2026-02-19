import { useNavigate } from "react-router-dom";
import { createSingleGame, createDoubleGame, joinGame, getAvailableGames } from "../apis";
import { useState, useRef, ChangeEvent } from "react";
import GameSelectionModal from "../components/GameSelectionModal";
import { debounce } from "../utils/debounce";
import { useToast } from "../context/ToastContext";

export default function ModeSelection() {
  const [games, setGames] = useState<{ name: string, id: string }[]>([])
  const [findGamesModalIsOpen, setFindGamesModalIsOpen] = useState(false)
  const [doublesGameName, setDoublesGameName] = useState("")
  const [doublesGameError, setDoublesGameError] = useState(false)
  const searchGameIDRef = useRef<string | undefined>(undefined)
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
    if (doublesGameName == "") {
      setDoublesGameError(true)
      return
    }
    try {
      await createDoubleGame(doublesGameName)
      navigate('/double')
    } catch (e) {
      console.log(e)
    }
  }

  const handleFetchGames = async (searchGameID?: string) => {
    try {
      const availableGames = await getAvailableGames(searchGameID)
      setGames(availableGames)
      setFindGamesModalIsOpen(true)
    } catch (e) {
      console.log(e)
    }
  }

  const handleJoinGame = async (gameID: string) => {
    const result = await joinGame(gameID)
    if (!result.success) {
      pushToast(result.message ?? "Failed to join game", "error")
      handleFetchGames(searchGameIDRef.current)
      return
    }
    navigate('/double')
  }

  const handleGameSearch = (input: string) => {
    searchGameIDRef.current = input
    debounce(() => {
      handleFetchGames(input)
    }, 800)
  }

  const { pushToast } = useToast();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a1a] gap-4 w-full">
      <h1 className="text-white text-5xl mb-8">
        Space Shooter 🚀
      </h1>

      <button
        onClick={() => handleSingleModeSelection()}
        className="w-[280px] p-4 text-lg font-bold text-white bg-[#1099bb] border-none rounded-lg cursor-pointer transition-colors duration-200 hover:bg-[#0d7a9a]"
      >
        Single Player
      </button>

      <div className="flex flex-col gap-1 bg-[#0d7a9a] items-center rounded-lg">
        <div className="py-3">
          <input
            placeholder="Game name"
            value={doublesGameName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => { setDoublesGameName(e.target.value); setDoublesGameError(false) }}
            className={`w-full h-10 text-base text-gray-800 bg-gray-50 border-2 rounded-lg outline-none transition-all duration-300 shadow-sm focus:border-[#667eea] focus:ring-2 focus:ring-[#667eea]/10 ${doublesGameError ? "border-red-500" : "border-gray-200"
              }`}
          />
        </div>
        <button
          onClick={() => handleDoubleModeSelection()}
          className="w-[280px] p-4 text-lg font-bold text-white bg-violet-600 border-none rounded-lg cursor-pointer transition-colors duration-200 hover:bg-violet-700"
        >
          Create Multiplayer Game
        </button>
      </div>

      <button
        onClick={() => handleFetchGames(searchGameIDRef.current)}
        className="w-[280px] p-4 text-lg font-bold text-white bg-violet-600 border-none rounded-lg cursor-pointer transition-colors duration-200 hover:bg-violet-700"
      >
        Find Multiplayer Game
      </button>
      <GameSelectionModal
        isOpen={findGamesModalIsOpen}
        games={games}
        onJoinGame={(gameID) => handleJoinGame(gameID)}
        onRefresh={() => handleFetchGames(searchGameIDRef.current)}
        searchGame={(input: string) => handleGameSearch(input)}
        setIsOpen={setFindGamesModalIsOpen}
      />
    </div>
  );
}
