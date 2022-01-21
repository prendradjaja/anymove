import { BoardConfig, ChessBoardInstance, Piece, PositionType, OrientationType } from 'chessboardjs';

import { MoveList } from './move-list';

declare const Chessboard: any;


let moveList: MoveList;
const positionStack: string[] = [];
let board: ChessBoardInstance;

const config: BoardConfig = {
  draggable: true,
  dropOffBoard: 'trash',
  onDrop: onDrop as any,
  position: 'start'
};

board = Chessboard('myBoard', config)


// TODO type source and target
function onDrop(
  source: string,
  target: string,
  coloredPiece: Piece,
  newPos: PositionType,
  oldPos: PositionType,
  orientation: OrientationType
) {
  if (target !== 'offboard') {
    positionStack.push(Chessboard.objToFen(oldPos));
    const piece = coloredPiece[1];
    const isCapture = Object.keys(newPos).length < Object.keys(oldPos).length;

    moveList.add({
      source,
      target,
      piece,
      isCapture,
    });
  } else if (moveList.lastMove()) {
    console.log('TODO: Handle offboard');
    // const move = moveList.lastMove();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const moveListElement = document.querySelector('#move-list');
  if (!moveListElement) {
    throw new Error('#move-list not found');
  }
  moveList = new MoveList(moveListElement as HTMLElement);
});

document.querySelector('button#undo')!.addEventListener('click', () => {
  const position = positionStack.pop();
  if (!position) {
    return;
  }
  board.position(position, false);
  moveList.remove();
});
