import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { prisma } from "../../infra/database/prisma";

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const users = await prisma.user.findMany()

    return {
        statusCode: 200,
        body: JSON.stringify(users)
    };
}
