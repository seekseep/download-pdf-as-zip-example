import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { format } from 'date-fns'
import {
  createTable,
  getCoreRowModel,
  getPaginationRowModel,
  useTableInstance,
} from '@tanstack/react-table'

import { createPersonPdfFile } from '../services/pdf'
import { downloadPdfFiles } from '../services/zip'

const table = createTable()

export default function Home() {
  const [rowSelection, setRowSelection] = useState({})

  const columns = useMemo(() => [
      table.createDisplayColumn({
        id: 'select',
        header: ({ instance }) => (
          <IndeterminateCheckbox
            {...{
              checked: instance.getIsAllRowsSelected(),
              indeterminate: instance.getIsSomeRowsSelected(),
              onChange: instance.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      }),
      table.createGroup({
        id: 'name',
        accessorKey: 'name',
        header: 'Name',
        footer: null,
      }),
      table.createGroup({
        id: 'age',
        accessorKey: 'age',
        header: 'Age',
        footer: null,
      }),
      table.createGroup({
        id: 'bio',
        accessorKey: 'bio',
        header: 'Bio',
        footer: null,
      }),
    ],
    []
  )

  const data = useMemo(() => [{
    name: "Amanda Glover",
    age: 60,
    bio: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur sunt officia dolorum recusandae temporibus dignissimos eveniet quam totam, odit, soluta nam commodi placeat fugiat voluptas doloribus quia nihil vero! Est."
  }, {
    name: "Dale Shaw",
    age: 29,
    bio: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur sunt officia dolorum recusandae temporibus dignissimos eveniet quam totam, odit, soluta nam commodi placeat fugiat voluptas doloribus quia nihil vero! Est."
  }, {
    name: "Zachary McGuire",
    age: 40,
    bio: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur sunt officia dolorum recusandae temporibus dignissimos eveniet quam totam, odit, soluta nam commodi placeat fugiat voluptas doloribus quia nihil vero! Est."
  }, {
    name: "Gordon Wolfe",
    age: 64,
    bio: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur sunt officia dolorum recusandae temporibus dignissimos eveniet quam totam, odit, soluta nam commodi placeat fugiat voluptas doloribus quia nihil vero! Est."
  }], [])

  const instance = useTableInstance(table, {
    data,
    columns,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
  })

  const download = useCallback(async () => {
    const people = []
    for (let index in rowSelection) {
      if (!rowSelection[index]) continue
      people.push(data[index])
    }

    const personPdfFiles = people.map(person => createPersonPdfFile(person))

    await downloadPdfFiles(`People-${format(new Date(), 'yyyy-MM-dd_HH-mm')}`, personPdfFiles)
  }, [data, rowSelection])

  return (
    <div className="p-4 flex flex-col gap-4">
      <table>
        <thead>
          {instance.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} className="border-b-2">
              {headerGroup.headers.map(header => {
                return (
                  <th key={header.id} colSpan={header.colSpan} className="p-2">
                    {header.isPlaceholder ? null : (
                      <>
                        {header.renderHeader()}
                      </>
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {instance.getRowModel().rows.map(row => {
            return (
              <tr key={row.id} className="border-b">
                {row.getVisibleCells().map(cell => {
                  return <td className="p-2" key={cell.id}>{cell.renderCell()}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div>
        <button className="p-2 bg-gray-100 rounded" onClick={download}>
          Download PDF
        </button>
      </div>
    </div>
  );
}

function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}) {
  const ref = useRef(null)

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, indeterminate])

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + ' cursor-pointer'}
      {...rest}
    />
  )
}
