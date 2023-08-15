const AddComment = require ('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
    constructor({ threadRepository, commentRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async execute(useCasePayload) {
        await this._threadRepository.verifyThreadAvailability(useCasePayload.thread_id);
        const addComment = new AddComment(useCasePayload);
        return this._commentRepository.addComment(addComment);
    }
}

module.exports = AddCommentUseCase;
