interface StaffItem {
  id: string;
  avatar: string;
  name: string;
  phone: string;
  wechat: string;
  remark?: string;
}

// 本地模拟数据：便于快速搭建页面和联调前自测
export const defaultStaffList: StaffItem[] = [
  {
    id: 'u_001',
    avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=admin1',
    name: '王小明',
    phone: '13800138000',
    wechat: 'wx_admin_01',
    remark: '销售负责人'
  },
  {
    id: 'u_002',
    avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=admin2',
    name: '李小红',
    phone: '13900139000',
    wechat: 'wx_admin_02',
    remark: '客户跟进'
  }
];
