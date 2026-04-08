import type { PaginationReq, SortReq } from '../types';

// 订单查询参数：支持分页与排序
export interface OrderListReq {
  pagination?: PaginationReq;
  params?: { [key: string]: any };
  sort?: SortReq;
}

/**
 * 账单DTO，账单信息传输对象
 */
export interface OrderDto {
    /**
     * 创建时间
     */
    createTime?: Date;
    /**
     * 账单ID
     */
    id?: string;
    /**
     * 订单ID
     */
    orderId?: string;
    orderInfo?: OrderInfo;
    /**
     * 更新时间
     */
    updateTime?: Date;
}
/**
 * 订单信息，订单详细信息
 */
export interface OrderInfo {
    /**
     * 聊手ID
     */
    chatHandsId?: string;
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
    /**
     * 更新时间
     */
    updateTime?: Date;
}
