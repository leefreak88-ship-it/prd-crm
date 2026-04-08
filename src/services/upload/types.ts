/*
 * @Author: zhihao li leefreak88@gmail.com
 * @Date: 2026-04-02 21:49:29
 * @LastEditors: zhihao li leefreak88@gmail.com
 * @LastEditTime: 2026-04-02 21:52:16
 * @FilePath: \pd_crm\src\services\upload\types.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const UPLOAD_MAX_FILE_COUNT = 20;
export const UPLOAD_MAX_FILE_SIZE = 10 * 1024 * 1024;
export const UPLOAD_ACCEPT_EXTENSIONS = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'xls', 'xlsx'] as const;

export type UploadAcceptExtension = (typeof UPLOAD_ACCEPT_EXTENSIONS)[number];

export interface UploadFileItem {
  fileId?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
}

export interface UploadFailedItem {
  fileName?: string;
  reason?: string;
}

export interface UploadBatchData {
  successList?: UploadFileItem[];
  failList?: UploadFailedItem[];
}

export interface UploadSingleData extends UploadFileItem {}

export interface UploadApiEnvelope<T> {
  code?: number;
  data?: T;
  msg?: string;
  ok?: boolean;
}

export interface UploadResult {
  mode: 'single' | 'batch';
  successList: UploadFileItem[];
  failList: UploadFailedItem[];
}

export interface UploadOptions {
  files: File | File[];
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
  retryTimes?: number;
}

export class UploadError extends Error {
  statusCode?: number;
  code?: number;
  data?: unknown;

  constructor(message: string, payload?: { statusCode?: number; code?: number; data?: unknown }) {
    super(message);
    this.name = 'UploadError';
    this.statusCode = payload?.statusCode;
    this.code = payload?.code;
    this.data = payload?.data;
  }
}
