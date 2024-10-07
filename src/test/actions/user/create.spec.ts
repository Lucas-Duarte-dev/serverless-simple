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
                findFirst: jest.fn(),
                create: jest.fn()
            }
        }
    }
})

import { handler } from "../../../actions/user/create";
import { prisma } from "../../../infra/database/prisma";
import { APIGatewayProxyEvent } from "aws-lambda";

beforeEach(() => {
    jest.clearAllMocks();
})


describe("Create User", () => {
    it("should create a new user", async () => {
        const event = {
            body: JSON.stringify({
                name: "John Doe",
                username: "john_doe"
            })
        }

        const user = {
            id: 1,
            name: "John Doe",
            username: "john_doe"
        }

        jest.spyOn(prisma.user, "findFirst").mockResolvedValue(null);
        jest.spyOn(prisma.user, "create").mockResolvedValue(user as any);

        const response = await handler(event as APIGatewayProxyEvent);

        expect(response.statusCode).toBe(200);
        expect(response.body).toBe(JSON.stringify(user));
    });

    it("should not create a new user if it already exists", async () => {
        const event = {
            body: JSON.stringify({
                name: "John Doe",
                username: "john_doe"
            })
        }

        jest.spyOn(prisma.user, "findFirst").mockResolvedValue({} as any);

        const response = await handler(event as APIGatewayProxyEvent);

        expect(response.statusCode).toBe(400);
        expect(response.body).toBe(JSON.stringify({
            message: "User already exists"
        }));
    });

    it("should not create a new user if the request is invalid", async () => {
        const event = {
            body: null
        }

        const response = await handler(event as any);

        expect(response.statusCode).toBe(400);
        expect(response.body).toBe(JSON.stringify({
            message: "Invalid request"
        }));
    });
});
