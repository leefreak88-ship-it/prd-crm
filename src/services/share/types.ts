/*
 * @Author: zhihao li leefreak88@gmail.com
 * @Date: 2026-03-31 21:18:27
 * @LastEditors: zhihao li leefreak88@gmail.com
 * @LastEditTime: 2026-03-31 21:27:43
 * @FilePath: \pd_crm\src\services\bills\types.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { PaginationReq, SortReq } from '../types';

// 账单查询参数：支持分页与排序
export interface ShareListReq {
  pagination?: PaginationReq;
  params?: { [key: string]: any };
  sort?: SortReq;
}

/**
 * ShareTemplate 分享模板
 */
export interface ShareTemplate {
    createTime?: Date;
    deleted?: number;
    id?: string;
    shareModelImage1?: string;
    shareModelImage2?: string;
    shareModelName?: string;
    shareModelTitle?: string;
    shareModelType?: number;
    updateTime?: Date;
    version?: number;
}

/**
 * ShareModel 分享模型
 */
export interface ShareModel {
    createTime?: Date;
    deleted?: number;
    id?: string;
    shareModelImage1?: string;
    shareModelImage2?: string;
    shareModelName?: string;
    shareModelTitle?: string;
    shareModelType?: number;
    updateTime?: Date;
    version?: number;
}