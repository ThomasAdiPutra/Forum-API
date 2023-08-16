/* eslint-disable no-restricted-syntax */
const DetailComment = require('../../Domains/comments/entities/DetailComment');
const DetailThread = require('../../Domains/threads/entities/DetailThread');

class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository, userRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._userRepository = userRepository;
  }

  async execute(id) {
    let thread = await this._threadRepository.getThreadById(id);
    const comments = await this._commentRepository.getCommentsByThreadId(id);
    const user = await this._userRepository.getUsernameById(thread.owner);
    thread.username = user;
    const newComments = [];

    thread = new DetailThread(thread);
    for (const comment of comments) {
      if (comment.deleted_at) {
        comment.content = '**komentar telah dihapus**';
      }
      // eslint-disable-next-line no-await-in-loop
      comment.username = await this._userRepository.getUsernameById(comment.owner);
      newComments.push(new DetailComment(comment));
    }

    thread.comments = newComments;

    return { ...thread };
  }
}

module.exports = GetDetailThreadUseCase;
