import { NextResponse } from 'next/server';
import { db } from "@/database/drizzle";
import { students, users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { getSmartContractViewOnly } from "@/utils/getSmartContractViewOnly";
import { BytesLike, EventLog } from "ethers";


export const POST = async (req: Request) => {
    const { tokenId } = await req.json();
  
    if (!tokenId || tokenId === 0) {
        return NextResponse.json({ error: "Invalid tokenId" }, { status: 400 });
    }
  
    const result = await db
      .select({ studentId: students.studentId, userId: students.userId })
      .from(students)
      .where(eq(students.studentId, tokenId));
  
    console.log("Student Query Result:", result);

    if (!result) {
        return NextResponse.json({ error: "Student ID not found" }, { status: 404 });
    }
  
    const studentId = result[0]?.studentId;
    const studentUserId = result[0]?.userId;
  
    const tokenizerContract = getSmartContractViewOnly();
  
    const checkIfHashStored = async (hash: BytesLike): Promise<boolean> => {
        return await tokenizerContract.getStoredHashValue(hash);
    };
  
    const mintedTokenEvents = await tokenizerContract.queryFilter("TokenMinted");
    const recentMintEvents = mintedTokenEvents.reverse();
  
    let mintEvent = null;
  
    for (const event of recentMintEvents) {
        const { args, transactionHash } = event as EventLog;
        const [id, hash, timestamp] = args;
    
        if (!(await checkIfHashStored(hash))) continue;
    
        const convertedTimestamp = new Date(Number(timestamp) * 1000).toLocaleString();
    
        if (id == studentId) {
            mintEvent = {
            pdfHash: hash,
            eventTimestamp: convertedTimestamp,
            eventHash: transactionHash,
            };
            break;
        }
    }
  
    console.log("Mint Event:", mintEvent);
  
    if (result.length > 0 && studentUserId && tokenId !== 0 && mintEvent) {
        const userResult = await db
            .select({
                studentNumber: users.userId,
                firstName: users.firstName,
                middleName: users.middleName,
                lastName: users.lastName,
            })
            .from(users)
            .where(eq(users.userId, studentUserId));
    
        console.log("User Query Result:", userResult);
    
        if (userResult.length > 0) {
            const mergedData = {
            userId: studentId,
            ...userResult[0],
            ...mintEvent,
            };
    
            console.log("Merged Data:", mergedData);
    
            return NextResponse.json({ data: mergedData, status: 200 });
        } else {
            return NextResponse.json({ error: "User not found", status: 404 });
        }
    }
  
    return NextResponse.json({ error: "No matching event or student", status: 404 });
}
  