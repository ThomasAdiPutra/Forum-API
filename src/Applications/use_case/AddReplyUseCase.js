const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const { thread_id, comment_id } = useCasePayload;
    await this._threadRepository.verifyThreadAvailability(thread_id);
    await this._commentRepository.verifyCommentAvailability(comment_id);
    await this._commentRepository.verifyInThread({ id: comment_id, thread_id });
    const addReply = new AddReply(useCasePayload);
    return this._replyRepository.addReply(addReply);
  }
}

module.exports = AddReplyUseCase;
