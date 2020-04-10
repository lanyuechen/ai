import React from 'react';

import style from './style.css';

function chessType(n) {
  return ['empty', 'black', 'white', 'candidate'][n];
}

export default function (props) {
  const { width = 300, data, onClick } = props;

  const unit = 100 / (data.length - 1);
  const contentWidth = 100 / (100 + 2 * unit) * 100;
  const edge = (100 - contentWidth) / 2;
  
  return (
    <div className={style.container} style={{width, height: width}}>
      <div 
        className={style.grid}
        style={{
          backgroundSize: `${unit}% ${unit}%`,
          width: `${contentWidth}%`,
          height: `${contentWidth}%`,
          left: `${edge}%`,
          top: `${edge}%`,
        }}
      />
      <div 
        className={style.rowNo} 
        style={{
          width: `${edge}%`,
          height: `${100 - edge}%`,
          top: `${edge / 2}%`,
        }}
      >
        {data.map((d, i) => (
          <div key={i}>{i}</div>
        ))}
      </div>
      <div 
        className={style.colNo}
        style={{
          width: `${100 - edge}%`,
          height: `${edge}%`,
          left: `${edge / 2}%`,
        }}
      >
        {data.map((d, i) => (
          <div key={i}>{i}</div>
        ))}
      </div>
      <div
        className={style.board}
        style={{
          width: `${100 - edge}%`,
          height: `${100 - edge}%`,
          left: `${edge / 2}%`,
          top: `${edge / 2}%`,
        }}
      >
        {data.map((row, i) => (
          <div className={style.row} key={i}>
            {row.map((col, j) => (
              <div 
                key={j} 
                className={style.chess}
                data-type={chessType(col)}
                onClick={(e) => onClick(i, j, e)}
              >
                {col}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
