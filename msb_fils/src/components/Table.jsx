import { Eye, Pencil, Trash2 } from "lucide-react";

export default function Table({
    columns = [],
    data = [],
    actions = {},
}) {
    return (
        <div className="table-responsive">

            <table className="erp-table">

                <thead>

                    <tr>

                        {columns.map(col => (

                            <th
                                key={col.key}
                                className={col.mobile === false ? "hide-mobile" : ""}
                            >
                                {col.label}
                            </th>

                        ))}

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {data.map((row) => (

                        <tr key={row.id}>

                            {columns.map(col => (

                                <td
                                    key={col.key}
                                    className={col.mobile === false ? "hide-mobile" : ""}
                                >

                                    {col.render
                                        ? col.render(row)
                                        : row[col.key]}

                                </td>

                            ))}

                            <td>
                                {/**
                                <div className="table-actions">

                                    {actions.view && (

                                        <button
                                            onClick={() => actions.view(row)}
                                        >
                                            <Eye size={18}/>
                                        </button>

                                    )}

                                    {actions.edit && (

                                        <button
                                            onClick={() => actions.edit(row)}
                                        >
                                            <Pencil size={18}/>
                                        </button>

                                    )}

                                    {actions.delete && (

                                        <button
                                            onClick={() => actions.delete(row)}
                                        >
                                            <Trash2 size={18}/>
                                        </button>

                                    )}

                                </div>
                                */}

                                <div className="table-actions">

                                    {actions.view && actions.view(row)}

                                    {actions.edit && actions.edit(row)}

                                    {actions.delete && actions.delete(row)}

                                    {actions.print && actions.print(row)}

                                </div>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}