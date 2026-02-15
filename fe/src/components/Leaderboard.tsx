import { formatDate } from "../utils/dates";
import { ReactNode, useEffect, useState } from "react";
import Table from "./basics/Table";

const Leaderboard = ({
    leaderboard
}: {
    leaderboard: any[]
}) => {
    const [transformedLeaderboard, setTransformedLeaderboard] = useState<ReactNode[][]>([])
    const tableWrapperStyle: React.CSSProperties = {
        overflow: 'auto',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
    };

    const getRankStyle = (index: number): React.CSSProperties => ({
        fontWeight: 'bold',
        fontSize: '18px',
        color: index === 0 ? '#eab308' : index === 1 ? '#9ca3af' : index === 2 ? '#ea580c' : '#000',
    });

    const scoreStyle: React.CSSProperties = {
        backgroundColor: '#dbeafe',
        color: '#1e40af',
        padding: '4px 12px',
        borderRadius: '9999px',
        fontWeight: '600',
        display: 'inline-block',
    };

    useEffect(() => {
        const finalLeaderboard: ReactNode[][] = []
        for (let i = 0; i < leaderboard.length && i<10; i++) {
            const currentRow = leaderboard[i]
            const currentTransformedRow: ReactNode[] = []
            currentTransformedRow.push(
                <span style={getRankStyle(i)}>
                    {i === 0 && '🥇'}
                    {i === 1 && '🥈'}
                    {i === 2 && '🥉'}
                    {i > 2 && `#${i + 1}`}
                </span>
            )
            currentTransformedRow.push(
                <span>{currentRow.name}</span>
            )
            currentTransformedRow.push(
                <span style={scoreStyle}>
                    {currentRow.score.toLocaleString()}
                </span>
            )
            currentTransformedRow.push(
                <span> {formatDate(currentRow.createdAt)}</span>
            )
            finalLeaderboard.push(currentTransformedRow)
        }
        setTransformedLeaderboard(finalLeaderboard)
    }, [leaderboard])

    return (
        <div style={tableWrapperStyle}>
            <Table
                headers={["Rank","Name","Score","Date"]}
                data={transformedLeaderboard}
            />
        </div>
    )
}

export default Leaderboard