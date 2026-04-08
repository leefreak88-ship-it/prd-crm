/*
 * @Author: zhihao li leefreak88@gmail.com
 * @Date: 2026-04-02 18:26:51
 * @LastEditors: zhihao li leefreak88@gmail.com
 * @LastEditTime: 2026-04-02 18:28:07
 * @FilePath: \pd_crm\src\hooks\share\useShareQuery.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useQuery } from '@tanstack/react-query';
import { fetchShareList } from '@/services/share/api';

export function useShareQuery() {
  return useQuery({
    queryKey: ['share', 'list'],
    queryFn: () => fetchShareList({ pagination: { current: 1, pageSize: 100 } }),
    select: (resp) => resp.result || []
  });
}
