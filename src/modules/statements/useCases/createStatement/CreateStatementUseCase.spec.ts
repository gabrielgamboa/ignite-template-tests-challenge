import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        statementsRepository = new InMemoryStatementsRepository();
        createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
    });

    it("should be able to create a new deposit statement in user account", async () => {
        const user = await usersRepository.create({
            email: "gabriel@email.com",
            name: "gabriel gamboa",
            password: "1234",
        });

        const statement: ICreateStatementDTO = {
            amount: 1000,
            description: "Statement example",
            type: OperationType.DEPOSIT,
            user_id: user.id!
        };

        const result = await createStatementUseCase.execute(statement);
        expect(result).toHaveProperty("id");
    });

    it("should be able to create a withdraw statement in user account", async () => {
        const user = await usersRepository.create({
            email: "gabriel@email.com",
            name: "gabriel gamboa",
            password: "1234",
        });

        const depositStatement: ICreateStatementDTO = {
            amount: 2000,
            description: "Statement example",
            type: OperationType.DEPOSIT,
            user_id: user.id!
        };

        await createStatementUseCase.execute(depositStatement);

        const withdrawStatement: ICreateStatementDTO = {
            amount: 1000,
            description: "Statement example",
            type: OperationType.WITHDRAW,
            user_id: user.id!
        };

        const result = await createStatementUseCase.execute(withdrawStatement);
        expect(result).toHaveProperty("id");
    });

    it("should not be able to create a new deposit statement in a non existing user ", async () => {
        expect(async () => {
            await createStatementUseCase.execute({
                amount: 1000,
                description: "Statement example",
                type: OperationType.DEPOSIT,
                user_id: "id"
            });
        }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
    });

    it("should be able to create a withdraw statement in user account if balance is negative", async () => {
        expect(async () => {
            const user = await usersRepository.create({
                email: "gabriel@email.com",
                name: "gabriel gamboa",
                password: "1234",
            });
    
            const depositStatement: ICreateStatementDTO = {
                amount: 2000,
                description: "Statement example",
                type: OperationType.DEPOSIT,
                user_id: user.id!
            };
    
            await createStatementUseCase.execute(depositStatement);
    
            const withdrawStatement: ICreateStatementDTO = {
                amount: 3000,
                description: "Statement example",
                type: OperationType.WITHDRAW,
                user_id: user.id!
            };
    
            await createStatementUseCase.execute(withdrawStatement);
        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
    });
});