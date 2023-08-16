class DeleteReplyUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    const {
      id, comment_id, thread_id, owner,
    } = useCasePayload;
    await this._threadRepository.verifyThreadAvailability(thread_id);
    await this._commentRepository.verifyCommentAvailability(comment_id);
    await this._commentRepository.verifyInThread({ id: comment_id, thread_id });
    await this._replyRepository.verifyInComment({ id, comment_id });
    await this._replyRepository.verifyOwner({ id, owner });
    await this._replyRepository.softDeleteReply(id);
  }

  _validatePayload({
    id, comment_id, thread_id, owner,
  }) {
    if (!id || !comment_id || !thread_id || !owner) {
      throw new Error('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof comment_id !== 'string' || typeof thread_id !== 'string' || typeof owner !== 'string') {
      throw new Error('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteReplyUseCase;
