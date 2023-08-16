class DeleteCommentUseCase {
  constructor({
    commentRepository,
  }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    const { id, thread_id, owner } = useCasePayload;
    await this._commentRepository.verifyInThread({ id, thread_id });
    await this._commentRepository.verifyOwner({ id, owner });
    await this._commentRepository.softDeleteComment(id);
  }

  _validatePayload({ id, thread_id, owner }) {
    if (!id || !thread_id || !owner) {
      throw new Error('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof thread_id !== 'string' || typeof owner !== 'string') {
      throw new Error('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteCommentUseCase;
