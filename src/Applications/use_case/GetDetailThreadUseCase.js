/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const DetailComment = require('../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../Domains/replies/entities/DetailReply');
const DetailThread = require('../../Domains/threads/entities/DetailThread');

class GetDetailThreadUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository, userRepository, commentLikeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._userRepository = userRepository;
    this._commentLikeRepository = commentLikeRepository;
  }

  async execute(id) {
    let thread = await this._threadRepository.getThreadById(id);
    const comments = await this._commentRepository.getCommentsByThreadId(id);
    const user = await this._userRepository.getUsernameById(thread.owner);
    thread.username = user;
    const newComments = [];

    thread = new DetailThread(thread);
    for (let comment of comments) {
      if (comment.deleted_at) {
        comment.content = '**komentar telah dihapus**';
      }
      comment.username = await this._userRepository.getUsernameById(comment.owner);
      comment.likeCount = await this._commentLikeRepository.getLikeCountByCommentId(comment.id);
      comment = new DetailComment(comment);
      const replies = await this._replyRepository.getRepliesByCommentId(comment.id);
      const newReplies = [];
      for (let reply of replies) {
        if (reply.deleted_at) {
          reply.content = '**balasan telah dihapus**';
        }
        reply.username = await this._userRepository.getUsernameById(reply.owner);
        reply = new DetailReply(reply);
        newReplies.push(reply);
      }

      comment.replies = newReplies;
      newComments.push(comment);
    }

    thread.comments = newComments;

    return { ...thread };
  }
}

module.exports = GetDetailThreadUseCase;
