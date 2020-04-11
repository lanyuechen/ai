import Board from "./board";

const LIVE_4        = 1000000;
const DOUBLE_LIVE_3 = 100000;
const LIVE_3        = 10000;
const LIVE_2        = 1000;
const SLEEP_4       = 1000;
const SLEEP_3       = 100;
const SLEEP_2       = 10;

const SEARCH_DIRECTIONS = [
  (i, j, step) => [i, j + step],          // 向右搜索
  (i, j, step) => [i + step, j],          // 向下搜索
  (i, j, step) => [i + step, j + step],   // 向右下搜索
  (i, j, step) => [i - step, j + step],   // 向右上搜索
];

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
  const sign = role === Board.BLACK ? 1 : -1;
  for (let fn of SEARCH_DIRECTIONS) {
    point += search(state, i, j, role, fn);
    if (!Number.isFinite(point)) {
      return Infinity * sign;
    }
  }

  return point * sign;
}

function search(state, i, j, role, step) {
  const board = state.board;
  const [li, lj] = step(i, j, -1);  // 前置位置
  if (board[li] && board[li][lj] === role) {
    return 0;
  }

  let c = 0;
  while(board[i] && board[i][j] === role) {
    c++;
    [i, j] = step(i, j, 1);
  }
  if (c >= 5) {
    return Infinity;
  }
  const s = state.canPut(li, lj);
  const e = state.canPut(i, j);
  if (s && e) {
    return ratingLive(c);
  } else if (s || e) {
    return ratingSleep(c);
  }
  return 0;
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

// 眠棋评分，单侧可以落子
function ratingSleep(r) {
  if (r === 4) {
    return SLEEP_4;
  } else if (r === 3) {
    return SLEEP_3;
  } else if (r === 2) {
    return SLEEP_2;
  } else {
    return 0;
  }
}