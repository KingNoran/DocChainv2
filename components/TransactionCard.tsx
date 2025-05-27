import React, { useState, useEffect } from 'react';
import { getSmartContractViewOnly } from "@/utils/getSmartContractViewOnly";
import { EventLog, BytesLike } from "ethers";
import { Card, CardContent } from './ui/card';


type TransactionData = {
  userId: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  pdfHash: string;
  eventTimestamp: string;
  eventHash: string;
}

const TransactionCard = ({ data }: { data: TransactionData }) => {
  return (
    <Card>
      <CardContent>
        <div className='flex flex-col align-middle gap-3'>
          <h2>TOR hash is stored on-chain and verified</h2>
          <p className='font-bold text-lg'>Transaction Hash: {data.eventHash}</p>
          <p>Token ID: {data.userId}</p>
          <p>Student name: {data.firstName} {data.middleName === null ? '' : `${data.middleName}`} {data.lastName}</p>
          <p>TOR hash: {data.pdfHash}</p>
          <p>Timestamp: {data.eventTimestamp}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default TransactionCard
