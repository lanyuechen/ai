import validate from './validate';

export default class Ai {
  constructor(board, enhance) {
    this.board = board;
    if (enhance) {
      this.minimax = enhance(this.minimax.bind(this));
    }
  }

  async calc(deep, role = 1) {
    this.attempts = 0;
    const res = await this.minimax(this.board, deep, role);
    console.log('[minimax attempts]', this.attempts);
    return [res[0], res[1][0]];
  }

  async minimax(state, deep, role = 1, alpha = -Infinity, beta = Infinity) {
    this.attempts += 1;
    const candidates = state.getCandidates();
    if (!candidates || deep <= 0) {
      return [ validate(state), [] ];
    }

    let steps = [candidates[0]];
    if (role) {
      for (let i = 0; i < candidates.length; i++) {
        const [x, y] = candidates[i];
        state.putA(x, y); // 黑棋
        const [ point, _steps ] = await this.minimax(state, deep - 1, role ^ 1, alpha, beta);
        state.remove();
        if (point > alpha) {
          alpha = point;
          steps = [ [x, y], ..._steps ];
        }
        if (alpha >= beta) {
          return [ alpha, [[x, y], ..._steps]];
        }
      }
      return [ alpha, steps ];
    }

    for (let i = 0; i < candidates.length; i++) {
      const [x, y] = candidates[i];
      state.putB(x, y); // 白棋
      const [ point, _steps ] = await this.minimax(state, deep - 1, role ^ 1, alpha, beta);
      state.remove(x, y);
      if (point < beta) {
        beta = point;
        steps = [ [x, y], ..._steps ];
      }
      if (alpha >= beta) {
        return [ beta, [[x, y], ..._steps]];
      }
    }
    return [ beta, steps ];
  }
}
