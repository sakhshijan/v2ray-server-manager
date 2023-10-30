import axios, { AxiosInstance } from "axios";
import { decodeString } from "@/lib/hasing";

interface IResult<T> {
  msg: string;
  success: boolean;
  obj: T;
}

interface Client {
  id: number;
  inboundId: number;
  enable: boolean;
  email: string;
  up: number;
  down: number;
  expiryTime: number;
  total: number;
}

interface ClientSettings {
  email: string;
  enable: boolean;
  expiryTime: number;
  id: string;
  subId: string;
  tgId: string;
  totalGB: number;
}

export interface Inbound {
  id: number;
  up: number;
  down: number;
  total: number;
  remark: string;
  enable: boolean;
  expiryTime: number;
  clientStats: Client[];
  listen: string;
  port: number;
  protocol: string;
  settings: {
    clients: ClientSettings[];
    [key: string]: any;
  };
  streamSettings: {
    [key: string]: any;
    network: string;
    security: string;
    wsSettings: {
      acceptProxyProtocol: boolean;
      path: string;
      headers: any;
    };
  };
  sniffing: {
    enabled: boolean;
    destOverride: string[];
  };
}

interface Server {
  ip: string;
  port: number;
  path: string;
  username: string;
  password: string;
  accessToken: null | string;
}

export class VpsServer {
  axios: AxiosInstance;
  accessToken: string | null = null;

  constructor(private server: Server) {
    this.axios = axios.create({
      baseURL: `http://${server.ip}:${server.port}/${server.path}/`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    this.setCookie(server.accessToken || "", true);
  }

  setCookie(cookies: string, hashed?: boolean) {
    if (hashed && cookies) cookies = decodeString(cookies);
    this.accessToken = cookies;
    this.axios.defaults.headers.Cookie = this.accessToken;
  }

  async signIn() {
    const { username, password } = this.server;
    const credentials = { username, password };
    const { data } = await this.axios.post("login", credentials, {
      transformResponse: (data, headers) => {
        this.setCookie(
          headers.get("set-cookie")?.toString().split(" ")[0] || "",
        );
        return JSON.parse(data);
      },
    });
    return data as IResult<any>;
  }

  async getInbounds() {
    const { data } = await this.axios.post(
      "xui/inbound/list",
      {},
      {
        transformResponse: (data) => {
          return JSON.parse(data).obj.map((input: any) => {
            input.sniffing = JSON.parse(input.sniffing);
            input.streamSettings = JSON.parse(input.streamSettings);
            input.settings = JSON.parse(input.settings);
            return input;
          });
        },
      },
    );
    return data as Inbound[];
  }

  async addUser(inboundId: number, user: ClientSettings) {
    const data = {
      id: inboundId,
      settings: JSON.stringify({
        clients: [user],
      }),
    };

    const result = await this.axios.post(`xui/inbound/addClient`, data);
    return result.data as IResult<null>;
  }

  async updateUser(inboundId: number, user: ClientSettings) {
    const data = {
      id: inboundId,
      settings: JSON.stringify({
        clients: [user],
      }),
    };

    const result = await this.axios.post(
      `xui/inbound/updateClient/${user.id}`,
      data,
    );
    return result.data as IResult<null>;
  }

  async moveUser() {}

  async deleteUser(secret: string, inboundId: number) {
    const result = await this.axios.post(
      `xui/inbound/${inboundId}/delClient/${secret}`,
    );
    return result.data as IResult<null>;
  }

  async userTraffic(email: string) {
    const { data } = await this.axios.get(
      `xui/API/inbounds/getClientTraffics/${email}`,
      {},
    );
    return data.obj as Client;
  }

  async resetTraffic(inboundId: number, email: string) {
    const { data } = await this.axios.post(
      `xui/inbound/${inboundId}/resetClientTraffic/${email}`,
      {},
    );
    return data as IResult<null>;
  }

  async getInbound(id: number) {
    const { data } = await this.axios.get(`xui/API/inbounds/get/${id}`, {});
    return {
      ...data.obj,
      sniffing: JSON.parse(data.obj.sniffing),
      settings: JSON.parse(data.obj.settings),
      streamSettings: JSON.parse(data.obj.streamSettings),
    } as Inbound;
  }
}
