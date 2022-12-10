import { Request, ResponseToolkit } from "@hapi/hapi";
import AddUserUseCase from "../../../../Applications/use_case/AddUserUseCase";
import { Container } from "../../../../Infrastructures/container";

class UsersHandler {
  private container: Container;

  constructor(container: Container) {
    this.container = container;

    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler(request: Request, h: ResponseToolkit) {
    const addUserUseCase = this.container.getInstance(AddUserUseCase.name);
    const addedUser = await addUserUseCase.execute(request.payload);

    const response = h.response({
      status: "success",
      data: {
        addedUser,
      },
    });
    response.code(201);
    return response;
  }
}

export default UsersHandler;
