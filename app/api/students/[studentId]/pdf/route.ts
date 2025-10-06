export async function GET(req: Request, { params }: { params: { studentId : string; }}){
    return Response.json({
        test: params.studentId
    });
}

export async function POST(req: Request, { params }: { params: { studentId : string; }}){
    const body = await req.json();
    return Response.json({
        test: params.studentId,
        transcript: body
    });
}