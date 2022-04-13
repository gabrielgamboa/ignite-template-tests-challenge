import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show user profile", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });

  it("should be able to show profile for user", async () => {
    const user = await createUserUseCase.execute({
      name: "Gabriel",
      email: "gabriel@email.com",
      password: "123",
    });

    const profileUser = await showUserProfileUseCase.execute(user.id!);
    expect(profileUser).toMatchObject(user);
  });

  it("should not be able to show profile for non-existing user", () => {
    expect(async () => {
      await showUserProfileUseCase.execute("existing_id");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
