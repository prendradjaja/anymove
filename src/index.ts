import { BoardConfig, ChessBoardInstance, Piece, PositionType, OrientationType } from 'chessboardjs';

import { Move , redrawMoveList} from './move-list';

declare const Chessboard: any;


const state = {
  moves: [] as Move[],
  selectedMove: undefined as number | undefined,
};

// let moveList: MoveList;
const positionStack: string[] = [];
let board: ChessBoardInstance;

const config: BoardConfig = {
  draggable: true,
  // dropOffBoard: 'trash',
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

    // TODO1 If in the past, don't append but rewrite history
    state.moves.push({
      source,
      target,
      piece,
      isCapture,
    });
    state.selectedMove = state.moves.length - 1;
    redrawMoveList(state.moves, state.selectedMove);

    // moveList.select(moveList.moves.length - 1);
  } else if (
    // moveList.lastMove()
    true
  ) {
    console.log('TODO: Handle offboard');
    // const move = moveList.lastMove();
  }
}

document.addEventListener('keydown', (event: KeyboardEvent) => {
  // TODO1 Implement a position stack and use it to update board
  if (event.key === 'ArrowLeft') {
    // TODO DRY ArrowRight
    if (state.selectedMove !== undefined) {
      state.selectedMove = Math.max(state.selectedMove - 1, 0)
      redrawMoveList(state.moves, state.selectedMove);
    }
  } else if (event.key === 'ArrowRight') {
    // TODO DRY ArrowLeft
    if (state.selectedMove !== undefined) {
      state.selectedMove = Math.min(state.selectedMove + 1, state.moves.length - 1)
      redrawMoveList(state.moves, state.selectedMove);
    }
  }
});
