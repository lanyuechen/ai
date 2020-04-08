export default class Ai {
  constructor(board) {
    this.board = board;
    this.table = [];
    const res = this.minimax(this.board, 4);
    console.log('>>>', res);
    console.table(this.table);
  }

  minimax(state, deep, role = 1, alpha = -Infinity, beta = Infinity) {
    const candidates = this.getCandidates(state);
    if (!candidates || deep <= 0) {
      return [ this.validate(state) ];
    }

    let pos;
    if (role) {
      for (let i = 0; i < candidates.length; i++) {
        const [x, y] = candidates[i];
        state.put(x, y, 1); // 黑棋
        const [ point ] = this.minimax(state, deep - 1, role ^ 1, alpha, beta);
        
        this.table.push({
          type: 'max',
          state: state.board.toString(),
          deep,
          alpha,
          beta,
          point,
          position: `${x}, ${y}`
        });

        state.remove(x, y);
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
      state.put(x, y, 2); // 白棋
      const [ point ] = this.minimax(state, deep - 1, role ^ 1, alpha, beta);
      
      this.table.push({
        type: 'min',
        state: state.board.toString(),
        deep,
        alpha,
        beta,
        point,
        position: `${x}, ${y}`
      });

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

  /**
   * 获得备选落子方案
   */
  getCandidates(state) {
    // 最low的算法，返回所有未被占用的位置
    const res = [];
    for (let i = 0; i < state.board.length; i++) {
      for (let j = 0; j < state.board[i].length; j++) {
        if (state.board[i][j] === 0) {
          res.push([i, j]);
        }
      }
    }
    return res;
  }

  // 白棋，获取尽可能小的值
  validate(state) {
    let count = 0;
    for (let i = 0; i < state.board.length; i++) {
      for (let j = 0; j < state.board[i].length; j++) {
        const d = state.board[i][j];
        if (d === 1) {
          count += (i + j);
        } else if (d === 2) {
          count -= (i + j);
        }
      }
    }

    return count;
  }
}
