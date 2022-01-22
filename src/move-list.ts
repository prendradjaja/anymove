import { htmlToElement } from './util';

export interface Move {
  color: string;
  piece: string;
  source: string;
  target: string;
  isCapture?: boolean;
  promotedTo?: string;
  oldPosition: string;
  newPosition: string;
}

export function redrawMoveList(moves: Move[], selectedMove: number | undefined) {
  const moveList = document.querySelector('#move-list');
  if (!moveList) {
    throw new Error('#move-list not found');
  }

  moveList.innerHTML = '';

  for (let [i, move] of moves.entries()) {
    if (i === 0) { continue; }
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
  const promotionPart = move.promotedTo ? `=${move.promotedTo}` : '';
  const piece = move.piece !== '?' ? move.piece : move.source;
  if (piece !== 'P') {
    return piece + (move.isCapture ? 'x' : '') + move.target + promotionPart;
  } else {
    if (!move.isCapture) {
      return move.target + promotionPart;
    } else {
      return move.source[0] + 'x' + move.target + promotionPart;
    }
  }
}
