// 接口统一响应结构：后端返回的数据建议遵循该格式
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 通用分页结构：列表页可以直接复用
export interface PaginationResult<T> {
  list: T[];
  total: number;
}
