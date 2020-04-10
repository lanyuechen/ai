import React, { useState } from 'react';

import AI from '@/utils/ai';
import Board from '@/utils/board';

import BoardView from '@/components/board';

import style from './index.css';
import boardStyle from '@/components/board/style.css';

const board = new Board({ n: 15});
const ai = new AI(board);

export default function() {
  const [ rand, setRand ] = useState(0);

  const aiPut = () => {
    const [ point, pos ] = ai.calc(2);
    if (!pos) {
      alert('机器人认输了！');
      return;
    }
    const [ x, y ] = pos;
    console.log('[ai put]', x, y, point);
    ai.board.putA(x, y);
    setRand(Math.random());
  }

  const userPut = (x, y, e) => {
    if (e.metaKey) {
      remove(x, y);
      return;
    }
    
    console.log('[user put]', x, y);
    ai.board.putB(x, y);
    setRand(Math.random());
    aiPut();
  }

  const remove = (x, y) => {
    ai.board.remove(x, y);
    setRand(Math.random());
  }

  const refresh = () => {
    ai.board.clear();
    setRand(Math.random());
  }

  window.board = ai.board;
  const board = ai.board.board;

  const width = window.innerWidth < 420 ? window.innerWidth - 20 : 420;

  return (
    <div className={style.container} style={{width: width + 20}}>
      <h2 className={style.title}>AI五子棋 v1.0</h2>
      <BoardView
        width={width}
        data={board} 
        onClick={userPut}
      />
      <div className={style.toolbar}>
        <div className={style.user}>
          <div className={style.icon} style={{float: 'left'}}>🤖️</div>
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
          <button className={style.btn} onClick={aiPut}>开始</button>
          &nbsp;&nbsp;
          <button className={style.btn} onClick={refresh}>重来</button>
        </div>
        <div className={style.user}>
          <div className={style.icon} style={{float: 'right'}}>😳</div>
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
    </div>
  );
}
