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
    <Card className='w-100 lg:w-auto md:w-auto p-4'>
      <CardContent className='px-2 lg:px-6 md:px-6'>
        <div className='flex flex-col align-middle gap-3'>
          <h2 className='text-emerald-400 text-center font-bold'>TOR hash is stored on-chain and verified!</h2>
          <hr></hr>
          <h2 className="font-bold mb-3 truncate w-90 lg:w-full md:w-full cursor-pointer">
            {"Transaction Hash: "}
            <a 
              className="text-green-500"
              href={`https://zksync-sepolia.blockscout.com/tx/${data.eventHash}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              {data.eventHash}
            </a>
          </h2>
          </div>
          <p className='w-full lg:my-0 md:my-0 my-3'>TOR hash: <span className='text-green-500 font-bold whitespace-normal break-all'>{data.pdfHash}</span></p>
          <p>Token ID: {data.userId}</p>
          <p>Student name: <span className='font-bold'>{data.firstName} {data.middleName === null ? '' : `${data.middleName}`} {data.lastName}</span></p>
          <p>Timestamp: {data.eventTimestamp}</p>
      </CardContent>
    </Card>
  )
}

export default TransactionCard
