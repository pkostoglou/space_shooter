import Modal from "./basics/Modal";
import Table from "./basics/Table";
import { useState, useEffect, ReactNode } from "react";

const GameSelectionModal = ({
    isOpen,
    games,
    onJoinGame,
    onRefresh,
    searchGame,
    setIsOpen
}: {
    isOpen: boolean;
    games: {name:string, id: string}[];
    onJoinGame: (gameID: string) => void
    onRefresh: () => void
    searchGame: (input: string) => void
    setIsOpen: (openStatus: boolean) => void
}) => {

    const [transformedGames, setTransformedGames] = useState<ReactNode[][]>([])

    useEffect(() => {
        let finalGames: ReactNode[][] = []
        for (let i = 0; i < games.length; i++) {
            const currentRow = games[i]
            const transformedRow: ReactNode[] = []
            transformedRow.push(
                <span className="text-black text-lg">{currentRow.name}</span>
            )
            transformedRow.push(
                <button
                    onClick={() => onJoinGame(currentRow.id)}
                    className="px-6 py-2.5 text-sm font-semibold text-white bg-[#667eea] border-none rounded-lg cursor-pointer shadow-[0_4px_15px_rgba(102,126,234,0.4)] transition-all duration-300 uppercase tracking-wide hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
                >Join</button>
            )
            finalGames.push(transformedRow)
        }
        setTransformedGames(finalGames)
    }, [games])

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <div className="w-full min-w-[400px] flex flex-col m-auto">
                <Table
                    headers={["Game Name", "Actions"]}
                    data={transformedGames}
                    tableActions={{
                        refresh: {
                            onRefresh
                        },
                        searchDocument: {
                            onType: (event) => {
                                searchGame(event.target.value)
                            },
                            placeholder: "Search by game id"
                        }
                    }}
                />
            </div>
        </Modal>
    );
};

export default GameSelectionModal;
