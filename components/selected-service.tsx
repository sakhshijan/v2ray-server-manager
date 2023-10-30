import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Database, Users } from "lucide-react";

interface SelectedServiceProps {
  service: {
    name: string;
    volume: number;
    time: number;
    accounts: number;
    id: number;
  };
}

const SelectedService = ({ service }: SelectedServiceProps) => {
  if (!service) return "";

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Traffic</CardTitle>
          <Database className="opacity-50" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{service.volume} GB</div>
          <p className="text-xs text-muted-foreground">
            Total data allowed to transfer.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Period</CardTitle>
          <CalendarDays className="opacity-50" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{service.time} Days</div>
          <p className="text-xs text-muted-foreground">
            The time limited on this service.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Clients</CardTitle>
          <Users className="opacity-50" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Unlimited</div>
          <p className="text-xs text-muted-foreground">
            Active client at same ip
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SelectedService;
