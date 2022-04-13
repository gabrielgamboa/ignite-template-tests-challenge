import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository);
  });

  it("should be able to get balance from user", async () => {
    const user =  await usersRepository.create({
        email: "gabriel@email.com",
        name: "gabriel gamboa",
        password: "1234",
    });

    const result = await getBalanceUseCase.execute({user_id: user.id!});
    const { balance, statement } = result;

    expect(balance).toBeGreaterThanOrEqual(0);
    expect(statement.length).toBeGreaterThanOrEqual(0);
  });

  it("should not be able to get balance from a non existing user", async () => {
    expect(async () => {
        await getBalanceUseCase.execute({user_id: "id"});
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});