
export default class Board {
  static EMPTY = 0;       // 空
  static BLACK = 1;       // 黑棋
  static WHITE = 2;       // 白棋
  static CANDIDATE = 3;   // 备选落子位置

  constructor(conf = { n: 15 }) {
    this.N = conf.n;                      // 棋盘大小
    this.R = 2;                           // 有效落子位置半径，距离某棋子超过该距离被认定为无效落子
    this.candidates = [];                 // 备选落子位置
    this.board = this.initBoard(this.N);  // 棋盘
    this.stack = [];                      // 落子状态
  }

  initBoard(n) {
    return new Array(n).fill(0).map(() => new Array(n).fill(Board.EMPTY));
  }

  updateCandidates(x, y) {
    const arr = [];
    for (let i = Math.max(x - this.R + 1, 0); i < Math.min(x + this.R, this.N); i++) {
      for (let j = Math.max(y - this.R + 1, 0); j < Math.min(y + this.R, this.N); j++) {
        if (this.board[i][j] === Board.EMPTY) {
          this.board[i][j] = Board.CANDIDATE;
          arr.push([i, j]);
        }
      }
    }
    this.candidates.push(arr);
  }

  popCandidates() {
    const arr = this.candidates.pop();
    for (let [x, y] of arr) {
      this.board[x][y] = Board.EMPTY;
    }
  }

  putA(x, y) {
    this.put(x, y, Board.BLACK);
  }

  putB(x, y) {
    this.put(x, y, Board.WHITE);
  }

  put(x, y, role) {
    if (!this.canPut(x, y)) {
      return;
    }
    this.board[x][y] = role; // 1: 黑棋， 2：白棋
    this.stack.push([x, y]);
    this.updateCandidates(x, y);
  }

  canPut(x, y) {
    return this.board[x] && (this.board[x][y] === Board.EMPTY || this.board[x][y] === Board.CANDIDATE);
  }

  remove(x, y) {
    this.board[x][y] = Board.CANDIDATE;
    this.stack.pop();
    this.popCandidates();
  }

  getCandidates() {
    if (!this.stack.length) {
      return [
        [(this.N / 2) >> 0, (this.N / 2) >> 0]
      ];
    }
    return this.candidates.flat().filter(([x, y]) => this.canPut(x, y));
  }
}
