import axios from "axios";


interface IIpLocation {
    "ip": string,
    "version": "IPv4" | "IPv6",
    "city": string,
    "region": string,
    "country": string,
    "countryName": string,
    "countryCode": string,
    "countryCapital": string,
    "timezone": string,
}

export async function getIpLocation(ip: string) {
    const {data} = await axios.get(`https://ipapi.co/${ip}/json/`);
    return {
        ...data,
        countryName: data.country_name,
        countryCode: data.country_code,
        countryCapital: data.country_capital
    } as IIpLocation
}
