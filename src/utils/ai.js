import validate from './validate';

export default class Ai {
  constructor(board) {
    this.board = board;
  }

  calc(deep, role = 1) {
    // this.table = [];
    const res = this.minimax(this.board, deep, role);
    // console.table(this.table);
    return res;
  }

  log(type, state, deep, alpha, beta, point, position) {
    if (!this.table) {
      return;
    }
    this.table.push({
      type,
      state: state.stack.slice(type === 'max' ? -1 : -2).map(d => d.toString()).join('|'),
      deep,
      alpha,
      beta,
      point,
      position
    });
  }

  minimax(state, deep, role = 1, alpha = -Infinity, beta = Infinity) {
    const candidates = state.getCandidates();
    if (!candidates || deep <= 0) {
      return [ validate(state), candidates[0] ];
    }

    let pos = candidates[0];
    if (role) {
      for (let i = 0; i < candidates.length; i++) {
        const [x, y] = candidates[i];
        state.putA(x, y); // 黑棋
        const [ point ] = this.minimax(state, deep - 1, role ^ 1, alpha, beta);
        
        this.log('max', state, deep, alpha, beta, point, `${x}, ${y}`);

        state.remove();
        if (point > alpha) {
          alpha = point;
          pos = [x, y];
        }
        if (alpha > beta) {
          return [ alpha, [x, y]];
        }
      }
      return [ alpha, pos ];
    }

    for (let i = 0; i < candidates.length; i++) {
      const [x, y] = candidates[i];
      state.putB(x, y); // 白棋
      const [ point ] = this.minimax(state, deep - 1, role ^ 1, alpha, beta);
      
      this.log('min', state, deep, alpha, beta, point, `${x}, ${y}`);

      state.remove(x, y);
      if (point < beta) {
        beta = point;
        pos = [x, y];
      }
      if (alpha > beta) {
        return [ beta, [x, y]];
      }
    }
    return [ beta, pos ];
  }
}
