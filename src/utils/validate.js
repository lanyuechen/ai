import Board from "./board";

const LIVE_5        = Infinity;
const LIVE_4        = 1000000;
const DOUBLE_LIVE_3 = 100000;
const LIVE_3        = 10000;
const LIVE_2        = 1000;

export default function(state) {
  const board = state.board;
  let point = 0;

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === Board.BLACK) {  // 搜索
        point += ratingSearch(state, i, j, Board.BLACK);
      } else if (board[i][j] === Board.WHITE) {
        point += ratingSearch(state, i, j, Board.WHITE);
      }
    }
  }

  return point;
}

function ratingSearch(state, i, j, role) {
  let point = 0;
  const board = state.board;
  const sign = role === Board.BLACK ? 1 : -1;

  // 向右搜索
  let r = 0;
  while(board[i][j + r] === role) r++;
  if (r === 5) {
    return Infinity;
  }
  if (state.canPut(i, j - 1) && state.canPut(i, j + r)) {
    point += ratingLive(r);
  }

  // 向下搜索
  let b = 0;
  while(board[i + b] && board[i + b][j] === role) b++;
  if (b === 5) {
    return Infinity;
  }
  if (state.canPut(i - 1, j) && state.canPut(i + b, j)) {
    point += ratingLive(b);
  }

  // 向右下搜索
  let rb = 0;
  while(board[i + rb] && board[i + rb][j + rb] === role) rb++;
  if (rb === 5) {
    return Infinity;
  }
  if (state.canPut(i - 1, j - 1) && state.canPut(i + rb, j + rb)) {
    point += ratingLive(rb);
  }

  // 向右上搜索
  let ru = 0;
  while(board[i - ru] && board[i - ru][j + ru] === role) ru++;
  if (ru === 5) {
    return Infinity;
  }
  if (state.canPut(i + 1, j - 1) && state.canPut(i - ru, j + ru)) {
    point += ratingLive(ru);
  }


  return point * sign;
}

// 活棋评分，两侧都可以落子
function ratingLive(r) {
  if (r === 4) {
    return LIVE_4;
  } else if (r === 3) {
    return LIVE_3;
  } else if (r === 2) {
    return LIVE_2;
  } else {
    return 0;
  }
}