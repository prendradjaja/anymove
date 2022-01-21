import { htmlToElement } from './util';

export interface Move {
  piece: string;
  source: string;
  target: string;
  isCapture?: boolean;
}

export function redrawMoveList(moves: Move[], selectedMove: number | undefined) {
  const moveList = document.querySelector('#move-list');
  if (!moveList) {
    throw new Error('#move-list not found');
  }

  moveList.innerHTML = '';

  for (let [i, move] of moves.entries()) {
    const moveString = moveToString(move);
    const moveElement = htmlToElement(`
      <div>${moveString}</div>
    `);
    if (selectedMove === i) {
      moveElement.classList.add('selected-move');
    }
    moveList.appendChild(moveElement);
  }
}

function moveToString(move: Move): string {
  return move.piece + (move.isCapture ? 'x' : '') + move.target;
}
