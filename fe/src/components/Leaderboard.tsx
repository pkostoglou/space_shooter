import { formatDate } from "../utils/dates";
import { ReactNode, useEffect, useState } from "react";
import Table from "./basics/Table";

const Leaderboard = ({
    leaderboard
}: {
    leaderboard: any[]
}) => {
    const [transformedLeaderboard, setTransformedLeaderboard] = useState<ReactNode[][]>([])

    const getRankClass = (index: number): string => {
        if (index === 0) return "font-bold text-lg text-yellow-500";
        if (index === 1) return "font-bold text-lg text-gray-400";
        if (index === 2) return "font-bold text-lg text-orange-600";
        return "font-bold text-lg text-black";
    };

    useEffect(() => {
        const finalLeaderboard: ReactNode[][] = []
        for (let i = 0; i < leaderboard.length && i<10; i++) {
            const currentRow = leaderboard[i]
            const currentTransformedRow: ReactNode[] = []
            currentTransformedRow.push(
                <span className={getRankClass(i)}>
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
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold inline-block">
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
        <div className="overflow-auto shadow-lg rounded-lg">
            <Table
                headers={["Rank","Name","Score","Date"]}
                data={transformedLeaderboard}
            />
        </div>
    )
}

export default Leaderboard
