import { Service, User } from "@prisma/client";
import { Inbound } from "@/VpsServer";
import { byteToGB } from "@/lib/utils";
import { format } from "date-fns";
import { Server } from ".prisma/client";

export class InboundConfig {
  constructor(
    public user: User,
    public inbound: Inbound,
    public activeService: Service & { server: Server },
  ) {}

  _vless() {
    const { secret, username } = this.user;
    const { server, expire, total } = this.activeService;
    const { port, streamSettings } = this.inbound;

    const { realitySettings } = streamSettings;
    const serverAddress =
      realitySettings?.settings?.serverName || server.domain || server.port;
    let url = `vless://${secret}@${serverAddress}:${port}?`;

    const config: any = {
      type: streamSettings.network,
      security: streamSettings.security,
    };
    if (realitySettings?.settings?.publicKey)
      config.pbk = realitySettings.settings.publicKey;
    if (realitySettings?.settings?.fingerprint)
      config.fp = realitySettings.settings.fingerprint;
    if (realitySettings?.shortIds?.length > 0)
      config.sid = realitySettings.shortIds[0];
    if (realitySettings?.serverNames?.length > 0)
      config.sni = realitySettings?.serverNames[0];

    url += new URLSearchParams(config).toString();
    url += `&spx=%2F#${username}-${byteToGB(total)}-${format(
      expire,
      "yyyy/M/dd",
    )}`;

    return url;
  }

  _vmess() {
    const { secret, username } = this.user;
    const { server, expire, total } = this.activeService;
    const { port, streamSettings } = this.inbound;
    const config = {
      v: "2",
      ps: `${username}-${byteToGB(total)}-${format(expire, "yyyy/M/dd")}`,
      add: server.domain || server.ip,
      port: port,
      id: secret,
      net: streamSettings.network,
      type: "none",
      tls: "none",
    };

    return `vmess://${btoa(JSON.stringify(config))}`;
  }

  getConfigs() {
    const { protocol } = this.inbound;

    switch (protocol) {
      case "vless":
        return this._vless();

      case "vmess":
        return this._vmess();
      default:
        return null;
    }
  }
}
