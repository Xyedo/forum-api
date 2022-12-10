/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
import { Thread } from "../../Commons/types";
import AddedDetailThread from "./entities/AddedDetailThread";
import AddedThread from "./entities/AddedThread";

class ThreadRepository {
  async addNewThread({ userId, title, body }: Thread): Promise<AddedThread> {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async verifyThreadAvaibility(threadId: string): Promise<void> {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getThreadDetailById(id: string): Promise<AddedDetailThread> {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}
export default ThreadRepository;
