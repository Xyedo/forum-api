import { DetailThread } from "../../../Commons/types";

export default class AddedDetailThread {
  public detailThread: DetailThread;

  constructor(payload: DetailThread) {
    this.detailThread = AddedDetailThread.cleanThread(payload);
  }

  private static cleanThread(threadDetail: DetailThread): DetailThread {
    const cleanThreadDetail = threadDetail;
    for (
      let i = 0;
      cleanThreadDetail.comments && i < cleanThreadDetail.comments.length;
      i += 1
    ) {
      const comment = cleanThreadDetail.comments[i];
      if (comment.isDelete === true) {
        comment.content = "**komentar telah dihapus**";
      }
      delete comment.isDelete;
      for (let j = 0; comment.replies && j < comment.replies.length; j += 1) {
        const reply = comment.replies[j];
        if (reply.isDelete === true) {
          reply.content = "**balasan telah dihapus**";
        }
        delete reply.isDelete;
      }
    }
    return cleanThreadDetail;
  }
}
