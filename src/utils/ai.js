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
    let res;
    for (let i = 2; i <= deep; i += 2) {
      res = await this.minimax(this.board, i, role);
      if (res[0] === Infinity) {
        console.log('[minimax attempts]>>>>', this.attempts);
        return res;
      } else if (res[0] === -Infinity) {
        console.log('[minimax attempts]<<<<', this.attempts);
      }
    }

    // const res = await this.minimax(this.board, deep, role);
    console.log('[minimax attempts]', this.attempts);
    return res;
  }

  async minimax(state, deep, role = 1, alpha = -Infinity, beta = Infinity) {
    this.attempts += 1;
    const candidates = state.getCandidates();
    if (!candidates || deep <= 0) {
      return [ validate(state), candidates[0] ];
    }

    let pos = candidates[0];
    if (role) {
      for (let i = 0; i < candidates.length; i++) {
        const [x, y] = candidates[i];
        state.putA(x, y); // 黑棋
        const [ point ] = await this.minimax(state, deep - 1, role ^ 1, alpha, beta);
        state.remove();
        if (point > alpha) {
          alpha = point;
          pos = [x, y];
        }
        if (alpha >= beta) {
          return [ alpha, [x, y]];
        }
      }
      return [ alpha, pos ];
    }

    for (let i = 0; i < candidates.length; i++) {
      const [x, y] = candidates[i];
      state.putB(x, y); // 白棋
      const [ point ] = await this.minimax(state, deep - 1, role ^ 1, alpha, beta);
      state.remove(x, y);
      if (point < beta) {
        beta = point;
        pos = [x, y];
      }
      if (alpha >= beta) {
        return [ beta, [x, y]];
      }
    }
    return [ beta, pos ];
  }
}
