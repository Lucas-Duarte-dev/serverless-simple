import { 
    beforeEach,
    expect,
    jest,
    it,
    describe
} from "@jest/globals";

jest.mock("../../../infra/database/prisma", () => {
    return {
        prisma: {
            user: {
                findMany: jest.fn()
            }
        }
    }
});

import { handler } from "../../../actions/user/list";
import { prisma } from "../../../infra/database/prisma";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

beforeEach(() => {
    jest.clearAllMocks();
})

interface User {
    id: number;
    username: string;
    name: string;
}

describe("List Users", () => {
    it("should list all users", async () => {
        const users: User[] = [{
            id: 1,
            name: "John Doe",
            username: "john_doe"
        }]

        jest.spyOn(prisma.user, "findMany").mockResolvedValue(users as any);

        const response = await handler({} as APIGatewayProxyEvent);

        expect(response.statusCode).toBe(200);
        expect(response.body).toBe(JSON.stringify(users));
    })
})
