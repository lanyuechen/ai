import Board from "./board";

const LIVE_4        = 1000000;
const DOUBLE_LIVE_3 = 100000;
const LIVE_3        = 10000;
const LIVE_2        = 1000;
const SLEEP_4       = 1000;
const SLEEP_3       = 100;
const SLEEP_2       = 10;

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
  if (board[i][j - 1] !== Board.role) {
    let r = 0;
    while(board[i][j + r] === role) r++;
    if (r === 5) {
      return sign * Infinity;
    }
    const s = state.canPut(i, j - 1);
    const e = state.canPut(i, j + r);
    if (s && e) {
      point += ratingLive(r);
    } else if (s || e) {
      point += ratingSleep(r);
    }
  }

  // 向下搜索
  if (!board[i -1] || board[i - 1][j] !== role) {
    let b = 0;
    while(board[i + b] && board[i + b][j] === role) b++;
    if (b === 5) {
      return  sign * Infinity;
    }
    const s = state.canPut(i - 1, j);
    const e = state.canPut(i + b, j);
    if (s && e) {
      point += ratingLive(b);
    } else if (s || e) {
      point += ratingSleep(b);
    }
  }

  // 向右下搜索
  if (!board[i - 1] || board[i - 1][j - 1] !== role) {
    let rb = 0;
    while(board[i + rb] && board[i + rb][j + rb] === role) rb++;
    if (rb === 5) {
      return sign * Infinity;
    }
    const s = state.canPut(i - 1, j - 1);
    const e = state.canPut(i + rb, j + rb);
    if (s && e) {
      point += ratingLive(rb);
    } else if (s || e) {
      point += ratingSleep(rb);
    }
  }

  // 向右上搜索
  if (!board[i + 1] || board[i + 1][j - 1] !== role) {
    let ru = 0;
    while(board[i - ru] && board[i - ru][j + ru] === role) ru++;
    if (ru === 5) {
      return sign * Infinity;
    }
    const s = state.canPut(i + 1, j - 1);
    const e = state.canPut(i - ru, j + ru);
    if (s && e) {
      point += ratingLive(ru);
    } else if (s || e) {
      point += ratingSleep(ru);
    }
  }

  return point * sign;
}
