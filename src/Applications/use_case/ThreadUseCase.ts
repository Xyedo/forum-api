import { Payload } from "../../Commons/types";
import ThreadRepository from "../../Domains/thread/ThreadRepository";
import NewThread from "../../Domains/thread/entities/NewThread";

type Deps = {
  threadRepository: ThreadRepository;
};

class ThreadUseCase {
  private threadRepo: ThreadRepository;

  constructor({ threadRepository }: Deps) {
    this.threadRepo = threadRepository;
  }

  async addNewThread(userId: unknown, { title, body }: Payload) {
    const validPayload = new NewThread({
      userId,
      title,
      body,
    });
    return this.threadRepo.addNewThread(validPayload);
  }

  async getDetailThread(threadId: string) {
    await this.threadRepo.verifyThreadAvaibility(threadId);
    const { detailThread } = await this.threadRepo.getThreadDetailById(
      threadId
    );
    return detailThread;
  }
}
export default ThreadUseCase;
