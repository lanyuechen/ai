import React, { useState, useMemo } from 'react';

import AI from '@/utils/ai';
import Board from '@/utils/board';

import BoardView from '@/components/board';
import { wait } from '@/utils/common';

import style from './index.css';
import boardStyle from '@/components/board/style.css';

const SEARCH_DEEP = 2;

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
  const [ current, setCurrent ] = useState();
  const enhance = (next) => async (...args) => {
    // await wait(500);
    const res = await next(...args);
    // log(...args, res[0]);
    return res;
  };
  const ai = useMemo(() => new AI(new Board({n: 15}), enhance), []);
  window.ai = ai;

  const aiPut = async () => {
    // table = [];
    const [ point, pos ] = await ai.calc(SEARCH_DEEP);
    // console.table(table);

    if (!pos) {
      alert('AI被难住了！');
      return;
    }
    const [ x, y ] = pos;
    console.log('[ai put]', x, y, point);
    ai.board.putA(x, y);
    setCurrent([x, y]);
    judge();
  }

  const userPut = (x, y) => {
    console.log('[user put]', x, y);
    if (ai.board.putB(x, y)) {
      setCurrent([x, y]);
      if (!judge()) {
        setTimeout(() => {
          aiPut();
        }, 0);
      }
    }
  }

  const userPutByAI = () => {
    const [ , pos ] = ai.calc(SEARCH_DEEP, 0);
    if (!pos) {
      alert('AI也不知道该往哪走了...');
      return;
    }
    const [ x, y ] = pos;
    userPut(x, y);
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
    setCurrent();
  }

  const retract = () => {
    setCurrent(ai.board.remove());
  }

  window.board = ai.board;
  const board = ai.board.board;

  const scale = window.innerWidth < 500 ? window.innerWidth / 500 : 1;

  return (
    <div className={style.container} style={{transform: `scale(${scale})`}}>
      <h2 className={style.title}>AI五子棋 v1.3</h2>
      <BoardView
        width={480}
        data={board} 
        current={current}
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
