// 统一本地 Mock：集中管理开发期假数据与接口行为，后续可整体移除
const mockDB = {
  chatHands: [
    {
      id: 'c_001',
      chatHandsName: '王小明',
      chatHandsPhone: '13800138000',
      chatHandsWx: 'wx_admin_01',
      remark: '销售负责人',
      status: 1,
      createTime: '2026-03-28 10:00:00',
      updateTime: '2026-03-28 11:00:00'
    },
    {
      id: 'c_002',
      chatHandsName: '李小红',
      chatHandsPhone: '13900139000',
      chatHandsWx: 'wx_admin_02',
      remark: '客户跟进',
      status: 1,
      createTime: '2026-03-29 09:30:00',
      updateTime: '2026-03-29 10:00:00'
    }
  ],
  bills: [
    {
      id: 'b_001',
      chatHandsId: 'c_001',
      goodsId: 'g_001',
      orderPrice: 1280000,
      shareModelId: 'sm_001',
      chatHandsInfo: { id: 'c_001', chatHandsName: '王小明', chatHandsPhone: '13800138000', remark: '核心销售' },
      shareModelInfo: { id: 'sm_001', shareModelName: '年费续费模版', shareModelTitle: '企业年费续费', shareModelType: 1 },
      createTime: '2026-03-28 10:00:00',
      updateTime: '2026-03-28 11:00:00'
    },
    {
      id: 'b_002',
      chatHandsId: 'c_002',
      goodsId: 'g_002',
      orderPrice: 3000000,
      shareModelId: 'sm_002',
      chatHandsInfo: { id: 'c_002', chatHandsName: '李小红', chatHandsPhone: '13900139000', remark: '实施跟进' },
      shareModelInfo: { id: 'sm_002', shareModelName: '实施服务模版', shareModelTitle: '系统实施套餐', shareModelType: 2 },
      createTime: '2026-03-29 09:30:00',
      updateTime: '2026-03-29 10:00:00'
    }
  ],
  orders: [
    {
      id: 'o_001',
      orderId: 'ORDER-2026-0001',
      orderInfo: { id: 'ord_001', chatHandsId: 'c_001', goodsId: 'g_001', orderPrice: 1280000, shareModelId: 'sm_001' },
      createTime: '2026-03-28 10:00:00',
      updateTime: '2026-03-28 11:00:00'
    },
    {
      id: 'o_002',
      orderId: 'ORDER-2026-0002',
      orderInfo: { id: 'ord_002', chatHandsId: 'c_002', goodsId: 'g_002', orderPrice: 3000000, shareModelId: 'sm_002' },
      createTime: '2026-03-29 09:30:00',
      updateTime: '2026-03-29 10:00:00'
    }
  ],
  goods: [
    {
      id: 'g_001',
      goodsName: '企业私域增长方案',
      goodsTypeId: 'pc_001',
      goodsPrice: 1280000,
      goodsImage: 'https://picsum.photos/seed/goods-001/200/120',
      idx: 1,
      deleted: 0,
      version: 1,
      createTime: '2026-03-27 09:00:00',
      updateTime: '2026-03-28 09:00:00'
    },
    {
      id: 'g_002',
      goodsName: '企业实施服务套餐',
      goodsTypeId: 'pc_002',
      goodsPrice: 3000000,
      goodsImage: 'https://picsum.photos/seed/goods-002/200/120',
      idx: 2,
      deleted: 0,
      version: 1,
      createTime: '2026-03-27 09:30:00',
      updateTime: '2026-03-28 09:30:00'
    }
  ],
  goodsType: [
    { id: 'pc_001', goodsTypeName: '咨询服务', idx: 1, deleted: 0, version: 1, createTime: '2026-03-26 10:00:00', updateTime: '2026-03-27 10:00:00' },
    { id: 'pc_002', goodsTypeName: '实施服务', idx: 2, deleted: 0, version: 1, createTime: '2026-03-26 10:30:00', updateTime: '2026-03-27 10:30:00' }
  ],
  shareModel: [
    { id: 'sm_001', shareModelName: '年费续费模版', shareModelTitle: '企业年费续费', shareModelType: 1, createTime: '2026-03-28 10:00:00', updateTime: '2026-03-28 11:00:00' },
    { id: 'sm_002', shareModelName: '实施服务模版', shareModelTitle: '系统实施套餐', shareModelType: 2, createTime: '2026-03-29 09:30:00', updateTime: '2026-03-29 10:00:00' }
  ]
};

// 读取请求体：兼容空 body 与非 JSON body
function readBody(req) {
  return new Promise((resolve) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf-8');
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (_) {
        resolve({ _raw: raw });
      }
    });
    req.on('error', () => resolve({}));
  });
}

function parseMultipartFileNames(raw) {
  if (!raw) {
    return [];
  }
  const matcher = /filename="([^"]+)"/g;
  const names = [];
  let result = matcher.exec(raw);
  while (result) {
    names.push(result[1]);
    result = matcher.exec(raw);
  }
  return names;
}

// 统一成功响应：对齐前端响应拦截器结构
function ok(data) {
  return { code: 0, msg: 'success', data };
}

// 统一列表分页：对齐 PaginationResp 结构
function page(data, payload) {
  const current = payload?.pagination?.current || 1;
  const size = payload?.pagination?.pageSize || 10;
  const start = (current - 1) * size;
  const end = start + size;
  return {
    current,
    size,
    total: data.length,
    result: data.slice(start, end)
  };
}

// 只读列表：用于仅查询模块，禁用增删改
function createReadOnlyPageHandler(key, prefix) {
  return async (method, path, body) => {
    if (method === 'POST' && path === `${prefix}/page`) {
      return ok(page(mockDB[key], body));
    }
    return null;
  };
}

// 通用 CRUD：减少重复代码，统一实体行为
function createCrudHandlers(key, prefix) {
  return async (method, path, body) => {
    const list = mockDB[key];
    if (method === 'POST' && path === `${prefix}/page`) {
      return ok(page(list, body));
    }
    if (method === 'POST' && path === `${prefix}/add`) {
      const item = { ...body, id: `${prefix.split('/').pop()}_${Date.now()}`, createTime: new Date().toISOString(), updateTime: new Date().toISOString() };
      mockDB[key] = [item, ...list];
      return ok(true);
    }
    if (method === 'PUT' && path === `${prefix}/update`) {
      mockDB[key] = list.map((item) => (item.id === body?.id ? { ...item, ...body, updateTime: new Date().toISOString() } : item));
      return ok(true);
    }
    if (method === 'DELETE' && path.startsWith(`${prefix}/delete/`)) {
      const id = path.replace(`${prefix}/delete/`, '');
      mockDB[key] = list.filter((item) => item.id !== id);
      return ok(true);
    }
    return null;
  };
}

const readOnlyRoutes = [
  createReadOnlyPageHandler('bills', '/api/background/bill'),
  createReadOnlyPageHandler('orders', '/api/background/order')
];

const crudRoutes = [
  createCrudHandlers('chatHands', '/api/background/chatHands'),
  createCrudHandlers('goods', '/api/background/goods'),
  createCrudHandlers('goodsType', '/api/background/goodsType'),
  createCrudHandlers('shareModel', '/api/background/shareModel')
];

// Vite 插件：开发期接管 /api 下业务接口
export function createMockPlugin() {
  return {
    name: 'unified-mock-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = (req.url || '').split('?')[0];
        const method = (req.method || 'GET').toUpperCase();
        if (!path.startsWith('/api/background/')) {
          next();
          return;
        }
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        const body = await readBody(req);
        if (method === 'POST' && path === '/api/background/user/login') {
          res.end(JSON.stringify(ok({ token: `mock-token-${Date.now()}`, userId: 'admin-001', userName: body?.userName || 'admin' })));
          return;
        }
        if (method === 'POST' && path === '/api/background/file/upload') {
          const names = parseMultipartFileNames(body?._raw);
          const fileName = names[0] || `mock_${Date.now()}.png`;
          res.end(
            JSON.stringify(
              ok({
                fileId: `file_${Date.now()}`,
                fileUrl: `https://picsum.photos/seed/${Date.now()}/200/120`,
                fileName,
                fileSize: 1024
              })
            )
          );
          return;
        }
        if (method === 'POST' && path === '/api/background/file/batchUpload') {
          const names = parseMultipartFileNames(body?._raw);
          const successList = names.map((fileName, index) => ({
            fileId: `file_${Date.now()}_${index + 1}`,
            fileUrl: `https://picsum.photos/seed/${Date.now()}_${index + 1}/200/120`,
            fileName,
            fileSize: 1024 + index
          }));
          res.end(JSON.stringify(ok({ successList, failList: [] })));
          return;
        }
        for (const route of readOnlyRoutes) {
          const result = await route(method, path, body);
          if (result) {
            res.end(JSON.stringify(result));
            return;
          }
        }
        for (const route of crudRoutes) {
          const result = await route(method, path, body);
          if (result) {
            res.end(JSON.stringify(result));
            return;
          }
        }
        res.statusCode = 404;
        res.end(JSON.stringify({ code: 404, msg: 'not found', data: null }));
      });
    }
  };
}
