import { NextResponse } from 'next/server';
import { db } from "@/database/drizzle";
import { students, users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { getSmartContractViewOnly } from "@/utils/getSmartContractViewOnly";
import { EventLog, JsonRpcProvider } from "ethers";


// THIS IS A PUBLIC API ENDPOINT
export const POST = async (req: Request) => {
    const { txLink } = await req.json();

    if (!txLink) {
        return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
    }

    const tokenizerContract = getSmartContractViewOnly();

    const provider = tokenizerContract.runner?.provider as JsonRpcProvider;
    const latestBlock = await provider.getBlockNumber();
    const fromBlock = Math.max(latestBlock - 5000, 0);

    const mintedTokenEvents = await tokenizerContract.queryFilter("TokenMinted", fromBlock, latestBlock);

    let matchedEvent = null;

    for (let i = mintedTokenEvents.length - 1; i >= 0; i--) {
        const { transactionHash } = mintedTokenEvents[i] as EventLog;
        if (txLink === transactionHash) {
            matchedEvent = mintedTokenEvents[i];
            break;
        }
    }

    let verificationResult = null;

    if (matchedEvent) {
        const { args, transactionHash } = matchedEvent as EventLog;
        const [tokenId, hash, timestamp] = args;

        verificationResult = {
            tokenId,
            pdfHash: hash,
            eventHash: transactionHash,
            eventTimestamp: new Date(Number(timestamp) * 1000).toLocaleString(),
        };
    }

    if (!verificationResult) return NextResponse.json({ error: "No matching blockchain event found" }, { status: 404 });

    const result = await db
        .select({ studentId: students.studentId, userId: students.userId })
        .from(students)
        .where(eq(students.studentId, verificationResult.tokenId));

    if (!result) {
        return NextResponse.json({ error: "Student ID not found" }, { status: 404 });
    }

    const studentId = result[0]?.studentId;
    const studentUserId = result[0]?.userId;

    if (result.length > 0 && studentUserId && verificationResult.tokenId !== 0 && verificationResult) {
        const userResult = await db
            .select({
                studentNumber: users.userId,
                firstName: users.firstName,
                middleName: users.middleName,
                lastName: users.lastName,
            })
            .from(users)
            .where(eq(users.userId, studentUserId));

        if (userResult.length > 0) {
            const mergedData = {
                userId: studentId,
                ...userResult[0],
                ...verificationResult,
            };

            const safeData = JSON.parse(
                JSON.stringify(mergedData, (_, value) =>
                    typeof value === "bigint" ? value.toString() : value
                )
            );

            return NextResponse.json({ data: safeData, status: 200 });
        } else {
            return NextResponse.json({ error: "User not found", status: 404 });
        }
    }

    return NextResponse.json({ error: "No matching event or student", status: 404 });
}
