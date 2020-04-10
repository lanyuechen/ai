import React, { useState } from 'react';

import AI from '@/utils/ai';
import Board from '@/utils/board';

import style from './index.css';

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

  const userPut = (e, x, y) => {
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

  window.board = ai.board;
  const board = ai.board.board;

  return (
    <div >
      <div>
        <button onClick={aiPut}>开始</button>
      </div>
      <pre>
        {`
const LIVE_4        = 1000000;
const DOUBLE_LIVE_3 = 100000;
const LIVE_3        = 10000;
const LIVE_2        = 1000;
const SLEEP_4       = 1000;
const SLEEP_3       = 100;
const SLEEP_2       = 10;
        `}
      </pre>
      <div className={style.board}>
        <div className={style.row}>
          <div className={style.col}></div>
          {board[0].map(((d, j) => (
            <div key={j} className={style.col}>{j}</div>
          )))}
        </div>
        {board.map((row, i) => (
          <div className={style.row} key={i}>
            <div className={style.col}>
              {i}
            </div>
            {row.map((col, j) => (
              <div 
                key={j}
                onClick={(e) => userPut(e, i, j)} 
                className={style.col}
                data-type={`col-${col}`}
              >
                {col}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
