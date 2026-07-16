type Align = "left" | "center" | "right";

export interface Column<T> {
    key: keyof T | string;
    label: string;
    width?: string;
    align?: Align;
    render?: (row: T, index: number) => React.ReactNode;
}
