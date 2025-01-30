// needed for row & cell level scope DnD setup
import { TableCell, TableRow } from '@/components/ui/table'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { flexRender, type Row } from '@tanstack/react-table'
import { type CSSProperties } from 'react'

import { cn } from '@/lib/utils'

type Props<T> = {
  row: Row<T>
  visibleHeaderColumns: number
  cellAlign: 'top' | 'middle'
  isSubTable: boolean
  dense: boolean
  semidense: boolean
  whiteBackground: boolean
  draggable: boolean
  draggableAdditionalData?: Record<string, keyof Row<T>>
  columnStyle?: Record<string, string>
  renderSubComponent?: (props: { row: Row<T> }) => React.ReactElement
}

export const DataTableRow = <T,>({
  row,
  visibleHeaderColumns,
  cellAlign,
  dense,
  isSubTable,
  semidense,
  whiteBackground,
  draggable,
  draggableAdditionalData,
  columnStyle,
  renderSubComponent
}: Props<T>) => {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: (row.original as { id: string }).id,
    data: draggableAdditionalData,
    disabled: !draggable
  })

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform), //let dnd-kit do its thing
    transition: transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative'
  }

  return (
    <>
      <TableRow
        style={style}
        ref={setNodeRef}
        className="hover:bg-transparent data-[state=selected]:bg-[#F2F6FB]"
        data-state={row.getIsSelected() && 'selected'}
      >
        {row.getVisibleCells().map((cell, idx) => (
          <TableCell
            key={cell.id}
            className={cn(
              row.getIsSelected()
                ? ''
                : 'bg-custom-pageBackground dark:bg-background',
              {
                'sticky left-0 z-[2]': idx === 0,
                'sticky right-0 z-[2]': idx === row.getVisibleCells().length - 1
              },
              'group-hover:bg-neutral-100 group-data-[state=selected]:bg-muted dark:group-hover:bg-neutral-900 dark:group-data-[state=selected]:bg-neutral-900',
              {
                'align-top': cellAlign === 'top'
              },
              {
                'bg-[#E8F1FA] group-hover:bg-blue-100': row.getIsExpanded()
              },
              {
                'bg-[#F2F6FB] group-hover:bg-[#E8F1FA]': isSubTable,
                'bg-white': whiteBackground
              },
              {
                'py-1': dense,
                'py-2': semidense
              },
              columnStyle && columnStyle[cell.column.id]
            )}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>

      {row.getIsExpanded() && renderSubComponent && (
        <TableRow className="m-0 p-0">
          <TableCell colSpan={visibleHeaderColumns} className="m-0 p-0">
            {renderSubComponent({ row })}
          </TableCell>
        </TableRow>
      )}
    </>
  )
}
