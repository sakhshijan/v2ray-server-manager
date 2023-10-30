"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  {
    name: "2023/5/6",
    total: Math.floor(Math.random() * 200) + 50,
    upload: Math.floor(Math.random() * 200) + 50,
    download: Math.floor(Math.random() * 200) + 50,
  },
  {
    name: "2023/5/7",
    total: Math.floor(Math.random() * 200) + 50,
    upload: Math.floor(Math.random() * 200) + 50,
    download: Math.floor(Math.random() * 200) + 50,
  },
  {
    name: "2023/5/8",
    total: Math.floor(Math.random() * 200) + 50,
    upload: Math.floor(Math.random() * 200) + 50,
    download: Math.floor(Math.random() * 200) + 50,
  },
  {
    name: "2023/5/9",
    total: Math.floor(Math.random() * 200) + 50,
    upload: Math.floor(Math.random() * 200) + 50,
    download: Math.floor(Math.random() * 200) + 50,
  },
  {
    name: "2023/5/10",
    total: Math.floor(Math.random() * 200) + 50,
    upload: Math.floor(Math.random() * 200) + 50,
    download: Math.floor(Math.random() * 200) + 50,
  },
  {
    name: "2023/5/11",
    total: Math.floor(Math.random() * 200) + 50,
    upload: Math.floor(Math.random() * 200) + 50,
    download: Math.floor(Math.random() * 200) + 50,
  },
  {
    name: "2023/5/12",
    total: Math.floor(Math.random() * 200) + 50,
    upload: Math.floor(Math.random() * 200) + 50,
    download: Math.floor(Math.random() * 200) + 50,
  },
  {
    name: "2023/5/13",
    total: Math.floor(Math.random() * 200) + 50,
    upload: Math.floor(Math.random() * 200) + 50,
    download: Math.floor(Math.random() * 200) + 50,
  },
  {
    name: "2023/5/14",
    total: Math.floor(Math.random() * 200) + 50,
    upload: Math.floor(Math.random() * 200) + 50,
    download: Math.floor(Math.random() * 200) + 50,
  },
  {
    name: "2023/5/15",
    total: Math.floor(Math.random() * 200) + 50,
    upload: Math.floor(Math.random() * 200) + 50,
    download: Math.floor(Math.random() * 200) + 50,
  },
  {
    name: "2023/5/16",
    total: Math.floor(Math.random() * 200) + 50,
    upload: Math.floor(Math.random() * 200) + 50,
    download: Math.floor(Math.random() * 200) + 50,
  },
  {
    name: "2023/5/17",
    total: Math.floor(Math.random() * 200) + 50,
    upload: Math.floor(Math.random() * 200) + 50,
    download: Math.floor(Math.random() * 200) + 50,
  },
  {
    name: "2023/5/18",
    total: Math.floor(Math.random() * 200) + 50,
    upload: Math.floor(Math.random() * 200) + 50,
    download: Math.floor(Math.random() * 200) + 50,
  },
  {
    name: "2023/5/19",
    total: Math.floor(Math.random() * 200) + 50,
    upload: Math.floor(Math.random() * 200) + 50,
    download: Math.floor(Math.random() * 200) + 50,
  },
];

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value} GB`}
        />
        <Tooltip
          formatter={(label, payload) => label + " GB"}
          labelStyle={{ color: "#ffffff55", fontSize: "12px" }}
          contentStyle={{
            background: "#000",
            border: "none",
            borderRadius: "5px",
            textTransform: "capitalize",
          }}
        />
        <CartesianGrid stroke="#eeeeee11" strokeDasharray="5 5" />
        <Line type="monotone" dataKey="download" stroke="#8884d8" />
        <Line type="monotone" dataKey="upload" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
}
