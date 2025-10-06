"use client";
import { requestColumns } from '@/components/admin/table/requests/columns';
import { DataTable } from '@/components/admin/table/DataTable';
import React, { useEffect, useState } from 'react'

const Page = () => {
  
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
      async function fetchData() {
        try {
          const [requestsRes, usersRes] = await Promise.all([
            fetch("/api/requests").then((r) => r.json()),
            fetch("/api/users").then((r) => r.json()),
          ]);

          console.log("Requests API response:", requestsRes);
          console.log("Users API response:", usersRes);

          const userMap = Object.fromEntries(
            usersRes.map((u: any) => [u.userId, `${u.firstName} ${u.lastName}`])
          );

          console.log("User map:", userMap);

          const parsed = requestsRes.map((req: any) => ({
            ...req,
            requesterId: userMap[req.requesterId] ?? req.requesterId,
            validatorId: req.validatorId
              ? userMap[req.validatorId] ?? req.validatorId
              : "Not validated",
          }));

          console.log("Parsed:", parsed);
          setData(parsed);
        } catch (err) {
          console.error("Fetch failed:", err);
        }
      }

      fetchData();
    }, []);
    
  return (
    <div>
      <DataTable columns={requestColumns} data={data} />
    </div>
  )
}

export default Page
