import { ReactNode, ChangeEvent } from "react";

const Table = ({
    headers,
    data,
    tableActions
}: {
    headers: string[],
    data: ReactNode[][],
    tableActions?: {
        refresh?: {
            onRefresh: () => void
        }
        searchDocument?: {
            onType: (event:ChangeEvent<HTMLInputElement>) => void
            placeholder?: string
        }
    }
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
        minWidth: '620px'
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
        padding: '16px 23px',
        color: 'black'
    };

    return (
        <div style={tableWrapperStyle}>
            {tableActions &&
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    backgroundColor: 'gray',
                    padding: '8px'
                }}>
                    {
                        tableActions.refresh &&
                        <button style={{
                            border:"none",
                            backgroundColor:"inherit",
                            fontSize: "24px",
                            paddingBottom: "4px",
                            paddingLeft: "24px",
                            color:"white",
                            cursor:"pointer"
                        }} onClick={tableActions.refresh.onRefresh}>
                            ⟳
                        </button>
                    }
                    {
                        tableActions.searchDocument &&
                        <input
                            onChange={tableActions.searchDocument.onType}
                            placeholder={tableActions.searchDocument.placeholder}
                        />
                    }
                </div>
            }
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