import { ReactNode } from "react";

const Table = ({
    headers,
    data
}: {
    headers: string[],
    data: ReactNode[][]
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

    const rowStyle: React.CSSProperties = {
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: 'white',
        transition: 'background-color 0.2s',
    };

    const tdStyle: React.CSSProperties = {
        padding: '16px 24px',
        color: 'black'
    };

    return (
        <div style={tableWrapperStyle}>
            <table style={tableStyle}>
                <thead style={theadStyle}>
                    <tr>
                        {
                            headers.map((header, key) => (
                                <th key={`${header}-${key}`} style={thStyle}>{header}</th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {data.map((dataRow, index) => (
                        <tr
                            key={index}
                            style={rowStyle}
                        >
                            {
                                dataRow.map((data, dataIndex) => (
                                    <td key={`${index}-${dataIndex}`} style={tdStyle}>
                                        {data}
                                    </td>
                                ))
                            }
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Table