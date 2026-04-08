/**
 * Pagination
 */
export interface PaginationReq {
    current?: number;
    pageSize?: number;
}
/**
 * Sort
 */
export interface SortReq {
    columnKey?: string;
    order?: string;
}

/** 公共分页响应体 */
export interface PaginationResp<T> {
    current?: number;
    result?: T[];
    size?: number;
    total?: number;
}

/**
 * Result«boolean»
 */
export interface MsgResponse {
    code?: number;
    data?: boolean;
    msg?: string;
    ok?: boolean;
}