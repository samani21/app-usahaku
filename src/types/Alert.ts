export interface AlertType {
    isOpen: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
}