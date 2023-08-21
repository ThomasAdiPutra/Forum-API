const ToggleLikeUseCase = require('../../../../Applications/use_case/ToggleLikeUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(request, h) {
    const owner = request.auth.credentials.id;
    const addReplyUseCase = this._container.getInstance(ToggleLikeUseCase.name);
    await addReplyUseCase.execute({
      ...request.params, owner,
    });

    const response = h.response({
      status: 'success',
    });

    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
