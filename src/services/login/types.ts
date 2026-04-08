/*
 * @Author: zhihao li leefreak88@gmail.com
 * @Date: 2026-04-01 10:00:11
 * @LastEditors: zhihao li leefreak88@gmail.com
 * @LastEditTime: 2026-04-01 22:10:38
 * @FilePath: \pd_crm\src\services\login\types.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * 用户登录信息，用户登录信息
 */
export interface loginRequest {
    /**
     * 用户密码
     */
    password?: string;
    /**
     * 用户名称
     */
    userName?: string;
}

/**
 * 登录成功数据，登录成功数据
 */
export interface LoginResponse {
    /**
     * token
     */
    token?: string;
    /**
     * 用户ID
     */
    userId?: string;
    /**
     * 用户名称
     */
    userName?: string;
}