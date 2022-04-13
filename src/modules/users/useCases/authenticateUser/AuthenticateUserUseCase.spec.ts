import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate User", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(usersRepository);
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
    });

    it("should be able to authenticate an existing user", async () => {
        const user: ICreateUserDTO = {
            name: "Gabriel",
            email: "gabriel@email.com",
            password: "123",
        };
      
        await createUserUseCase.execute(user);
        const authenticate = await authenticateUserUseCase.execute({email: user.email, password: user.password});
      
        expect(authenticate.token).toBeTruthy();
    });

    it("should not be able to authenticate user with non existent email", () => {
       expect(async () => {
        const user: ICreateUserDTO = {
            name: "Gabriel",
            email: "gabriel@email.com",
            password: "123",
        };

        await authenticateUserUseCase.execute({email: user.email, password: user.password});
       }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });

    it("should not be able to authenticate with incorrect password", () => {
        expect(async () => {
            const user: ICreateUserDTO = {
                email: "teste@gmail.com",
                name: "User test",
                password: "1234"
            }
    
            await createUserUseCase.execute(user);

            await authenticateUserUseCase.execute({
                email: user.email,
                password: "123456"
            });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });
});