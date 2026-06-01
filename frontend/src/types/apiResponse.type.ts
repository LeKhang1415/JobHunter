export interface ApiResponse<T> {
    message: string;
    statusCode: string;
    result: T;
}
