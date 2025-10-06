"use client";

import { DataTable } from "@/components/admin/table/DataTable"
import { adminColumns } from "@/components/admin/table/users/admins/columns";
import { registrarColumns } from "@/components/admin/table/users/registrars/columns";
import { useEffect, useState } from "react";

const Page = () => {

  const [adminData, setAdminData] = useState<any[]>([]);
  const [registrarData, setRegistrarData] = useState<any[]>([]);
      useEffect(() => {
        const fetchAdmins = async () => {
        try {
          const adminRes = await fetch("/api/admins"); // <-- updated endpoint
          const registrarRes = await fetch("/api/registrars");
          if (!adminRes.ok) {
            throw new Error("Failed to fetch admins");
          }
          if (!registrarRes.ok) {
            throw new Error("Failed to fetch registrars");
          }
            const adminData = await adminRes.json();
            const registrarData = await registrarRes.json();
            setAdminData(adminData);
            setRegistrarData(registrarData);
          } catch (err: any) {
            console.error("Fetch failed:", err);
          }
        };
        fetchAdmins();
      }, []);
  return (
    <div>
      <div className="text-center text-2xl font-bold">ADMINS</div>
      <DataTable columns={adminColumns} data={adminData} />
      <div className="text-center text-2xl font-bold">REGISTRARS</div>
      <DataTable columns={registrarColumns} data={registrarData} />
    </div>
  )
}

export default Page
