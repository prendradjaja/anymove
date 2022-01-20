import { BoardConfig, ChessBoardInstance } from 'chessboardjs';

declare const Chessboard: any;

const config: BoardConfig = {
  draggable: true,
  dropOffBoard: 'snapback', // this is the default
  onDrop: onDrop as any,
  position: 'start'
};

function onDrop(source: any, target: any, piece: any, newPos: any, oldPos: any, orientation: any) {
  console.log('Source: ' + source)
  console.log('Target: ' + target)
  console.log('Piece: ' + piece)
  console.log('New position: ' + Chessboard.objToFen(newPos))
  console.log('Old position: ' + Chessboard.objToFen(oldPos))
  console.log('Orientation: ' + orientation)
  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
}

const board: ChessBoardInstance = Chessboard('myBoard', config)
