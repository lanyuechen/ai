
export default class Board {
  constructor(n) {
    this.initBoard(n);
  }

  initBoard(m = 15, n) {
    this.board = new Array(m).fill(0).map(() => new Array(n || m).fill(0));
  }

  put(x, y, role) {
    this.board[x][y] = role; // 1: 黑棋， 2：白棋
  }

  remove(x, y) {
    this.board[x][y] = 0;
  }

  // 评估当前局势
  validate() {

  }
}