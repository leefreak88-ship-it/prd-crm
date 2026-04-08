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
export interface BillListReq {
  pagination?: PaginationReq;
  params?: { [key: string]: any };
  sort?: SortReq;
}

/**
 * 订单DTO，订单信息传输对象
 */
export interface BillDto {
    /**
     * 聊手ID
     */
    chatHandsId?: string;
    chatHandsInfo?: BillForChatterInfo;
    /**
     * 创建时间
     */
    createTime?: Date;
    /**
     * 商品ID
     */
    goodsId?: string;
    /**
     * 订单ID
     */
    id?: string;
    /**
     * 订单价格（单位：分）
     */
    orderPrice?: number;
    /**
     * 分享模版ID
     */
    shareModelId?: string;
    shareModelInfo?: BillShareModelInfo;
    /**
     * 更新时间
     */
    updateTime?: Date;
}

// 账单入参：新增与编辑共享
export interface BillPayload {
    /**
     * 聊手ID
     */
    chatHandsId?: string;
    /**
     * 商品ID
     */
    goodsId?: string;
    /**
     * 订单价格（单位：分）
     */
    orderPrice?: number;
    /**
     * 分享模版ID
     */
    shareModelId?: string;
}

/**
 * 聊手信息，聊手详细信息
 */
export interface BillForChatterInfo {
    /**
     * 聊手名称
     */
    chatHandsName?: string;
    /**
     * 聊手手机号
     */
    chatHandsPhone?: string;
    /**
     * 聊手ID
     */
    id?: string;
    /**
     * 备注
     */
    remark?: string;
}

/**
 * 分享模版信息，分享模版详细信息
 */
export interface BillShareModelInfo {
    /**
     * 分享模版ID
     */
    id?: string;
    /**
     * 模版主图
     */
    shareModelImage1?: string;
    /**
     * 模版副图
     */
    shareModelImage2?: string;
    /**
     * 模版名称
     */
    shareModelName?: string;
    /**
     * 模版标题
     */
    shareModelTitle?: string;
    /**
     * 模版类型
     */
    shareModelType?: number;
}
