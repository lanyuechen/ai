import React, { useState, useMemo } from 'react';

import AI from '@/utils/ai';
import Board from '@/utils/board';

import BoardView from '@/components/board';
import { wait } from '@/utils/common';

import style from './index.css';
import boardStyle from '@/components/board/style.css';

const SEARCH_DEEP = 4;

let table = [];

const log = (state, deep, role, alpha, beta, point) => {
  if (!table) {
    return;
  }
  table.push({
    state: state.stack.slice(role === 0 ? -1 : -2).map(d => d.toString()).join('|'),
    deep,
    role: role === 0 ? 'max' : 'min',
    alpha,
    beta,
    point,
  });
}

export default function() {
  const [ rand, setRand ] = useState(0);
  const enhance = (next) => async (...args) => {
    // await wait(500);
    const res = await next(...args);
    log(...args, res[0]);
    return res;
  };
  const ai = useMemo(() => new AI(new Board({n: 15}), enhance), []);

  const aiPut = async () => {
    table = [];
    const [ point, pos ] = await ai.calc(SEARCH_DEEP);
    console.table(table);

    if (!pos) {
      alert('AI被难住了！');
      return;
    }
    const [ x, y ] = pos;
    console.log('[ai put]', x, y, point);
    ai.board.putA(x, y);
    judge();
    setRand(Math.random());
  }

  const userPut = (x, y) => {
    console.log('[user put]', x, y);
    if (ai.board.putB(x, y)) {
      if (!judge()) {
        setTimeout(() => {
          aiPut();
        }, 0);
      }
      setRand(Math.random());
    }
  }

  const userPutByAI = () => {
    const [ point, pos ] = ai.calc(SEARCH_DEEP, 0);
    if (!pos) {
      alert('AI也不知道该往哪走了...');
      return;
    }
    const [ x, y ] = pos;
    console.log('[user put by ai]', x, y, point);
    ai.board.putB(x, y);
    judge();
    setRand(Math.random());
  }

  const judge = () => {
    const result = ai.board.judge();  // 胜负判定
    if (result === Board.BLACK) {
      setTimeout(() => {
        alert('😳你怎么连机器都赢不了。。。');
      }, 0);
      return true;
    } else if (result === Board.WHITE) {
      setTimeout(() => {
        alert('🤖️小伙子，可以啊！');
      }, 0);
      return true;
    }
  }

  const refresh = () => {
    ai.board.clear();
    setRand(Math.random());
  }

  const retract = () => {
    ai.board.remove();
    ai.board.remove();
    setRand(Math.random());
  }

  window.board = ai.board;
  const board = ai.board.board;

  const scale = window.innerWidth < 500 ? window.innerWidth / 500 : 1;

  return (
    <div className={style.container} style={{transform: `scale(${scale})`}}>
      <h2 className={style.title}>AI五子棋 v1.1</h2>
      <BoardView
        width={480}
        data={board} 
        onClick={userPut}
      />
      <div className={style.toolbar}>
        <div className={style.user}>
          <div 
            className={style.icon} 
            style={{float: 'left'}}
            onClick={aiPut}
          >
            🤖️
          </div>
          <div 
            className={boardStyle.chess} 
            data-type="black"
            style={{
              width: 20,
              height: 20
            }}
          />
        </div>
        <div>
          <button className={style.btn} onClick={refresh}>重来</button>
          &nbsp;&nbsp;
          <button className={style.btn} onClick={retract}>悔棋</button>
        </div>
        <div className={style.user}>
          <div 
            className={style.icon} 
            style={{float: 'right'}}
            onClick={userPutByAI}
          >
            😳
          </div>
          <div 
            className={boardStyle.chess} 
            data-type="white"
            style={{
              width: 20,
              height: 20
            }} 
          />
        </div>
      </div>
      {/* <div className={style.dogs}>
        恭喜你！
      </div> */}
      <div className={style.footer}>
        <a href="https://github.com/lanyuechen/ai">
          lanyuechen's GitHub
        </a>
      </div>
    </div>
  );
}
