import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const TableSkeleton = ({ rows = 5, columns = 5 }) => {
    return (
        <div className="border rounded">
            <Table>
                <TableHeader>
                    <TableRow>
                        {Array.from({ length: columns }).map((_, index) => (
                            <TableHead key={index} className="w-[120px]">
                                <div className="h-4 w-24 bg-gray-300 animate-pulse rounded"></div>
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <TableRow key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white" : "bg-muted/30"}>
                            {Array.from({ length: columns }).map((_, colIndex) => (
                                <TableCell key={colIndex}>
                                    <div className="h-4 w-full bg-gray-300 animate-pulse rounded"></div>
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default TableSkeleton;