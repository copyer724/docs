# fetch 二次封装

一点一点的完善

```ts
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type ResponseType = "json" | "text" | "blob" | "arrayBuffer" | "formData";

interface RequestOptions {
  method: HttpMethod;
  url: string;
  data?: any;
  responseType?: ResponseType;
  headers?: HeadersInit;
  noToken?: boolean;
}

interface HttpOptions {
  /** baseUrl */
  baseUrl: string;
  /** 自定义默认配置对象 */
  defaultOptions?: RequestInit;
  /** 自定义获取token方式 */
  getToken?: () => string;
}

const _defaultOptions = {
  mode: "cors",
};

/**
 * 获取当前用户的认证令牌。
 * @returns 返回当前用户的认证令牌，如果没有认证令牌则返回 null。
 */
const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export class Http {
  private readonly BASEURL: string;
  private readonly DEFAULT_OPTIONS: Record<string, any>;
  private readonly getToken: () => string | null;
  constructor(options: HttpOptions) {
    this.BASEURL = options.baseUrl;
    this.DEFAULT_OPTIONS = Object.assign(
      _defaultOptions,
      options?.defaultOptions ?? {}
    );
    this.getToken = options?.getToken ?? getToken;
  }
  async request(options: RequestOptions) {
    try {
      const {
        method,
        headers,
        noToken = false,
        data,
        responseType = "json",
      } = options;
      let url = options.url;
      const AUTH_TOKEN = noToken ? null : this.getToken();
      /** 地址拼接 */
      if (!/^http(s?):\/\//i.test(url)) {
        url = this.BASEURL + url;
      }
      // 配置对象
      const config: RequestInit = {
        method,
        headers: new Headers({
          "Content-Type": "application/json; charset=utf-8",
          ...headers,
          ...(AUTH_TOKEN ? { Authorization: `Bearer ${AUTH_TOKEN}` } : {}),
        }),
        ...(data ? { body: data } : {}),
        ...this.DEFAULT_OPTIONS,
      };
      // 如果请求方法需要数据并且数据是对象类型，则序列化数据。
      if (["POST", "PUT"].includes(method) && typeof data === "object") {
        config.body = JSON.stringify(data);
      }
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // 根据响应类型处理响应数据
      switch (responseType) {
        case "json":
          return response.json();
        case "text":
          return response.text();
        case "blob":
          return response.blob();
        case "arrayBuffer":
          return response.arrayBuffer();
        case "formData":
          return response.formData();
        default:
          throw new Error("Unsupported response type");
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      throw error;
    }
  }

  get(url: string, options?: Omit<RequestOptions, "method" | "url">) {
    return this.request({ method: "GET", url, ...options });
  }
  post(url: string, options: Omit<RequestOptions, "method" | "url">) {
    return this.request({ method: "POST", url, ...options });
  }
  put(url: string, options: Omit<RequestOptions, "method" | "url">) {
    return this.request({ method: "PUT", url, ...options });
  }
  delete(url: string, options: Omit<RequestOptions, "method" | "url">) {
    return this.request({ method: "DELETE", url, ...options });
  }
}

export const http = new Http({
  baseUrl: "http://localhost:3000",
});
```
