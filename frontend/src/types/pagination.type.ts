export interface PaginationQuery {
    page: number;
    limit: number;
}

export interface PaginationMeta {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}
