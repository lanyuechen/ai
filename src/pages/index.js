import React, { useEffect } from 'react';

import AI from '@/utils/ai';
import Board from '@/utils/board';

export default function() {
  useEffect(() => {
    const board = new Board(2);
    const ai = new AI(board);
  }, []);
  
  return (
    <div >
      hello world
    </div>
  );
}
