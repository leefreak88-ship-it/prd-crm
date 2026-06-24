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
export interface ChatterListReq {
  pagination?: PaginationReq;
  params?: { [key: string]: any };
  sort?: SortReq;
}

/**
 * Ch 聊手信息，聊手详细信息
 */
export interface Chatters {
    chatHandsName?: string;
    chatHandsPhone?: string;
    chatHandsWx?: string;
    chatHandsWxAvatar?: string;
    createTime?: Date;
    deleted?: number;
    id?: string;
    remark?: string;
    status?: number;
    updateTime?: Date;
    version?: number;
}

/**
 * 新增聊手参数
 */
export interface ChatterReq {
    chatHandsName?: string;
    chatHandsPhone?: string;
    chatHandsWx?: string;
    chatHandsWxAvatar?: string;
    createTime?: Date;
    deleted?: number;
    id?: string;
    remark?: string;
    status?: number;
    updateTime?: Date;
    version?: number;
}