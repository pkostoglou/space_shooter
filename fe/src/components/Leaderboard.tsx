import { formatDate } from "../utils/dates";

const Leaderboard = ({
    leaderboard
}:{
    leaderboard:any[]
}) => {
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
        background: '#3b82f6',
        color: 'white',
    };

    const thStyle: React.CSSProperties = {
        padding: '16px 24px',
        textAlign: 'left',
        fontWeight: '600',
    };

    const getRowStyle = (): React.CSSProperties => ({
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
    return (
        <div style={tableWrapperStyle}>
            <table style={tableStyle}>
                <thead style={theadStyle}>
                    <tr>
                        <th style={thStyle}>

                            <span>Rank</span>
                        </th>
                        <th style={thStyle}>Name</th>
                        <th style={thStyle}>Score</th>
                        <th style={thStyle}>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboard.slice(0, 10)
                        .sort((a, b) => b.score - a.score)
                        .map((player, index) => (
                            <tr
                                key={index}
                                style={getRowStyle()}
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
    )
}

export default Leaderboard