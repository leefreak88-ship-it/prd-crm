/*
 * @Author: zhihao li leefreak88@gmail.com
 * @Date: 2026-03-31 21:21:12
 * @LastEditors: zhihao li leefreak88@gmail.com
 * @LastEditTime: 2026-04-01 22:51:31
 * @FilePath: \pd_crm\src\services\products\types.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { PaginationReq, SortReq } from '../types';

// 商品查询参数：支持分页与排序
export interface ProductListReq {
  pagination?: PaginationReq;
  params?: { [key: string]: any };
  sort?: SortReq;
}

// 商品实体：用于商品管理列表与表单
export interface ProductItem {
  createTime?: Date;
  deleted?: number;
  goodsImage?: string;
  goodsName?: string;
  goodsPrice?: number;
  goodsTypeId?: string;
  id?: string;
  idx?: number;
  updateTime?: Date;
  version?: number;
}

// 商品入参：新增与编辑共享
export interface ProductPayload {
    createTime?: Date;
    deleted?: number;
    goodsImage?: string;
    goodsName?: string;
    goodsPrice?: number;
    goodsTypeId?: string;
    id?: string;
    idx?: number;
    updateTime?: Date;
    version?: number;
}

// 商品分类查询参数：支持分页与排序
export interface ProductCategoryListReq {
  pagination?: PaginationReq;
  params?: { [key: string]: any };
  sort?: SortReq;
}

// 商品分类实体：用于商品分类管理列表与表单
export interface ProductCategoryItem {
  createTime?: Date;
  deleted?: number;
  goodsTypeName?: string;
  id?: string;
  idx?: number;
  updateTime?: Date;
  version?: number;
}

// 新增商品分类入参：新增与编辑共享
export interface ProductCategoryItemPayload {
  createTime?: Date;
  deleted?: number;
  goodsTypeName?: string;
  id?: string;
  idx?: number;
  updateTime?: Date;
  version?: number;
}
