const WEIGHT_1 = 1000000;
const WEIGHT_2 = 100000;
const WEIGHT_3 = 10000;
const WEIGHT_4 = 1000;

export default function(state) {
  const mask = extract(state);

  if (mask.match(/11111/)) { // 黑棋五子(默认情况下，role = White的时候相反)
    return Infinity;
  }

  if (mask.match(/22222/)) { // 白棋五子
    return -Infinity; 
  }

  if (mask.match(/[03]1111|1[03]111|11[03]11|111[03]1|1111[03]/)) {  // 黑棋四子胜
    return WEIGHT_1;
  }

  if (mask.match(/[03]2222[03]/)) { // 白棋活四胜
    return -WEIGHT_1;
  }

  if (mask.match(/[03]2222|2[03]222|22[03]22|222[03]2|2222[03]/)) {  // 白棋四子
    return -WEIGHT_2;
  }

  const aLiveThree = mask.match(/[03]111[03]/g); // 活三
  if (aLiveThree) { // 黑活三胜
    return WEIGHT_1;
  }

  const bLiveThree = mask.match(/[03]222[03]/g);  // 活三
  if (bLiveThree) {
    if (bLiveThree.length > 1) { // 白双活三胜
      if (!mask.match(/[03]{2}111|[03]1[03]11|[03]11[03]1|1[03]11[03]|11[03]1[03]|111[03]{2}/)) {
        return -WEIGHT_1;
      }
      return -WEIGHT_2;
    }
    return -WEIGHT_3;
  }

  const aLiveTwo = mask.match(/[03]11[03]/g) || [];
  const bLiveTwo = mask.match(/[03]22[03]/g) || [];

  return (aLiveTwo.length - bLiveTwo.length) * WEIGHT_4;
}

function extract(state) {
  const board = state.board;

  const h = [];
  const v = [];
  const vt = [];
  const vb = [];

  for (let i = 0; i < board.length; i++) {
    h.push('x');
    v.push('x');
    vt.push('x');
    vb.push('x');
    for (let j = 0; j < board[i].length; j++) {
      h.push(board[i][j]);
      v.push(board[j][i]);
    }
    for (let j = 0; j <= i; j++) {
      vt.push(board[i - j][j]);
    }
    for (let j = 0; j < board[i].length - i; j++) {
      vb.push(board[j][i + j]);
    }
    if (i > 0) {
      vt.push('x');
      vb.push('x');
      for (let j = 0; j < board[i].length - i; j++) {
        vt.push(board[board[i].length - j - 1][j + i]);
        vb.push(board[i + j][j]);
      }
    }
  }

  return h.join('') + v.join('') + vt.join('') + vb.join('');
}