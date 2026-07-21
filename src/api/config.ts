// API配置文件
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const apiConfig = {
  baseUrl: API_BASE_URL,
  endpoints: {
    messages: '/messages',
    articles: '/articles',
    admin: '/admin'
  }
};

// 通用请求函数
async function request(url, options = {}) {
  const fullUrl = `${API_BASE_URL}${url}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  // 如果有管理员session，添加到请求头
  const adminSession = sessionStorage.getItem('m3eblog_admin_session');
  if (adminSession) {
    defaultOptions.headers['X-Admin-Session'] = adminSession;
  }
  
  const response = await fetch(fullUrl, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

export { request };
export default apiConfig;