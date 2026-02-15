import Modal from "./basics/Modal";
import Table from "./basics/Table";
import { useState, useEffect, ReactNode } from "react";

const GameSelectionModal = ({
    isOpen,
    games,
    onJoinGame
}: {
    isOpen: boolean;
    games: string[];
    onJoinGame: (gameID: string) => void
}) => {

    const [transformedGames, setTransformedGames] = useState<ReactNode[][]>([])

    useEffect(()=>{
        let finalGames:ReactNode[][] = []
        for(let i=0;i<games.length;i++){
            const currentRow = games[i]
            const transformedRow:ReactNode[] = []
            transformedRow.push(
                <span style={{
                    color:"black"
                }}>{currentRow}</span>
            )
            transformedRow.push(
                <button onClick={()=>onJoinGame(currentRow)}>Join</button>
            )
            finalGames.push(transformedRow)
        }
        setTransformedGames(finalGames)
    },[games])

    return (
        <Modal isOpen={isOpen}>
            <div style={{
                width: '50%',
                display: 'flex',
                flexDirection: 'column',
                gap: '0px',
                margin: 'auto'
            }}>
                <Table 
                    headers={["Game ID","Actions"]}
                    data={transformedGames}
                />
            </div>
        </Modal>
    );
};

export default GameSelectionModal;