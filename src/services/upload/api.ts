import axios from 'axios';
import { getAuthHeader } from '@/services/auth';
import { getBaseURLByEnv } from '@/utils/request';
import type {
  UploadApiEnvelope,
  UploadBatchData,
  UploadOptions,
  UploadResult,
  UploadSingleData
} from './types';
import {
  UPLOAD_ACCEPT_EXTENSIONS,
  UPLOAD_MAX_FILE_COUNT,
  UPLOAD_MAX_FILE_SIZE,
  UploadError as UploadErrorCtor
} from './types';

const SINGLE_UPLOAD_URL = '/background/file/upload';
const BATCH_UPLOAD_URL = '/background/file/batchUpload';

function getExt(fileName: string) {
  const ext = fileName.split('.').pop()?.trim().toLowerCase() || '';
  return ext;
}

function normalizeFiles(input: File | File[]) {
  return Array.isArray(input) ? input : [input];
}

function validateFiles(files: File[]) {
  if (files.length < 1) {
    throw new UploadErrorCtor('至少上传 1 个文件');
  }
  if (files.length > UPLOAD_MAX_FILE_COUNT) {
    throw new UploadErrorCtor(`最多上传 ${UPLOAD_MAX_FILE_COUNT} 个文件`);
  }
  for (const file of files) {
    if (file.size > UPLOAD_MAX_FILE_SIZE) {
      throw new UploadErrorCtor(`文件 ${file.name} 超过 10MB 限制`);
    }
    const ext = getExt(file.name);
    if (!UPLOAD_ACCEPT_EXTENSIONS.includes(ext as (typeof UPLOAD_ACCEPT_EXTENSIONS)[number])) {
      throw new UploadErrorCtor(`文件 ${file.name} 类型不支持`);
    }
  }
}

function parseUploadResult(mode: 'single' | 'batch', payload: UploadApiEnvelope<UploadBatchData | UploadSingleData>): UploadResult {
  if (payload.code !== 0 || payload.ok === false) {
    throw new UploadErrorCtor(payload.msg || '上传失败', { code: payload.code, data: payload.data });
  }
  if (mode === 'single') {
    const raw = payload.data as unknown;
    const data =
      typeof raw === 'string'
        ? ({ fileUrl: raw } as UploadSingleData)
        : ((raw || {}) as UploadSingleData & { url?: string; path?: string });
    const normalizedData: UploadSingleData = {
      ...data,
      fileUrl: data.fileUrl
    };
    return {
      mode,
      successList: normalizedData.fileId || normalizedData.fileUrl || normalizedData.fileName ? [normalizedData] : [],
      failList: []
    };
  }
  const data = (payload.data || {}) as UploadBatchData;
  return {
    mode,
    successList: data.successList || [],
    failList: data.failList || []
  };
}

function isNetworkError(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return false;
  }
  if (error.code === 'ERR_CANCELED') {
    return false;
  }
  return !error.response;
}

async function postUpload(
  url: string,
  formData: FormData,
  options: { signal?: AbortSignal; onProgress?: (percent: number) => void },
  mode: 'single' | 'batch'
) {
  const authHeader = getAuthHeader();
  const response = await axios.post<UploadApiEnvelope<UploadBatchData | UploadSingleData>>(url, formData, {
    baseURL: getBaseURLByEnv(),
    signal: options.signal,
    headers: {
      ...(authHeader ? { Authorization: authHeader } : {})
    },
    onUploadProgress: (event) => {
      if (!options.onProgress) {
        return;
      }
      if (!event.total || event.total <= 0) {
        options.onProgress(0);
        return;
      }
      options.onProgress(Math.round((event.loaded / event.total) * 100));
    }
  });

  if (response.status !== 200) {
    throw new UploadErrorCtor(`HTTP ${response.status}`, { statusCode: response.status, data: response.data });
  }
  return parseUploadResult(mode, response.data);
}

export async function uploadFiles(options: UploadOptions): Promise<UploadResult> {
  const files = normalizeFiles(options.files);
  validateFiles(files);
  const mode = files.length > 1 ? 'batch' : 'single';
  const url = mode === 'batch' ? BATCH_UPLOAD_URL : SINGLE_UPLOAD_URL;
  const fieldName = mode === 'batch' ? 'files' : 'file';
  const formData = new FormData();
  files.forEach((file) => formData.append(fieldName, file));
  const retryTimes = Math.max(0, options.retryTimes ?? 2);
  let attempt = 0;

  while (true) {
    try {
      return await postUpload(url, formData, { signal: options.signal, onProgress: options.onProgress }, mode);
    } catch (error) {
      if (error instanceof UploadErrorCtor) {
        throw error;
      }
      if (attempt >= retryTimes || !isNetworkError(error)) {
        if (axios.isAxiosError(error) && error.response) {
          throw new UploadErrorCtor(error.response.data?.msg || error.message || '上传失败', {
            statusCode: error.response.status,
            code: error.response.data?.code,
            data: error.response.data
          });
        }
        throw new UploadErrorCtor(axios.isAxiosError(error) ? error.message : '网络异常');
      }
      attempt += 1;
    }
  }
}

export function validateUploadFiles(files: File | File[]) {
  validateFiles(normalizeFiles(files));
}
