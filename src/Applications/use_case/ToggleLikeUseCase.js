class ToggleLikeUseCase {
  constructor({
    threadRepository, commentRepository, commentLikeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = commentLikeRepository;
  }

  async execute(useCasePayload) {
    const { thread_id, comment_id, owner } = useCasePayload;
    await this._threadRepository.verifyThreadAvailability(thread_id);
    await this._commentRepository.verifyCommentAvailability(comment_id);
    await this._commentRepository.verifyInThread({ id: comment_id, thread_id });
    const like = await this._likeRepository.findLikeByCommentOwnerId({ comment_id, owner });

    if (like.length > 0) {
      return this._likeRepository.softDeleteLike({ comment_id, owner });
    }

    return this._likeRepository.addLike(useCasePayload);
  }
}

module.exports = ToggleLikeUseCase;
