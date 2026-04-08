/*
 * @Author: zhihao li leefreak88@gmail.com
 * @Date: 2026-03-31 20:48:55
 * @LastEditors: zhihao li leefreak88@gmail.com
 * @LastEditTime: 2026-04-03 10:13:36
 * @FilePath: \pd_crm\vite.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
// import { createMockPlugin } from './mock.js';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
