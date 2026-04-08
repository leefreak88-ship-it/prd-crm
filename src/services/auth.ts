const LOGIN_KEY = 'pd_crm_admin_token';
const LOGIN_USER_KEY = 'pd_crm_admin_user';

export interface AuthUserInfo {
  userId?: string;
  userName?: string;
}

export function isLoggedIn() {
  return Boolean(getAccessToken());
}

export function getAccessToken() {
  return localStorage.getItem(LOGIN_KEY) || '';
}

export function getAuthHeader() {
  const token = getAccessToken();
  return token ? `Bearer ${token}` : '';
}

export function getCurrentUser() {
  // 读取当前登录用户信息：若数据损坏则自动清理
  const raw = localStorage.getItem(LOGIN_USER_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as AuthUserInfo;
  } catch (_) {
    localStorage.removeItem(LOGIN_USER_KEY);
    return null;
  }
}

export function loginAsAdmin(token?: string, userInfo?: AuthUserInfo) {
  // 写入登录 token：后续由请求拦截器统一注入请求头
  const nextToken = token?.trim() || 'admin-token';
  localStorage.setItem(LOGIN_KEY, nextToken);
  if (userInfo) {
    // 写入用户信息：用于页面展示当前登录用户
    localStorage.setItem(
      LOGIN_USER_KEY,
      JSON.stringify({
        userId: userInfo.userId || '',
        userName: userInfo.userName || ''
      })
    );
  }
}

export function logout() {
  // 退出登录：清理 token 与用户信息
  localStorage.removeItem(LOGIN_KEY);
  localStorage.removeItem(LOGIN_USER_KEY);
}
