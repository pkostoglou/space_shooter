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

    return (
        <div className="overflow-auto shadow-lg rounded-lg">
            {tableActions &&
                <div className="flex justify-between bg-gray-500 p-2">
                    {
                        tableActions.refresh &&
                        <button
                            className="border-none bg-inherit text-2xl pb-1 pl-6 text-white cursor-pointer"
                            onClick={tableActions.refresh.onRefresh}
                        >
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
            <table className="w-full bg-white border-collapse min-w-[620px]">
                <thead className="bg-blue-500 text-white">
                    <tr>
                        {
                            headers.map((header, key) => (
                                <th key={`${header}-${key}`} className="px-6 py-4 text-left font-semibold">{header}</th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {data.map((dataRow, index) => (
                        <tr
                            key={index}
                            className="border-b border-gray-200 bg-white hover:bg-gray-50 transition-colors duration-200"
                        >
                            {
                                dataRow.map((data, dataIndex) => (
                                    <td key={`${index}-${dataIndex}`} className="px-6 py-4 text-black">
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
