import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { prisma } from "../../infra/database/prisma";

type UserDTO = {
    name: string;
    username: string;
}

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Invalid request"
            })
        };
    }

    const {name, username} = JSON.parse(event.body) as UserDTO;


    const userAlreadyExists = await prisma.user.findFirst({
        where: {
            username
        }
    });

    if (userAlreadyExists) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "User already exists"
            })
        };
    }

    const user = await prisma.user.create({
        data: {
            name,
            username
        }
    })

    return {
        statusCode: 200,
        body: JSON.stringify(user)
    };
}
