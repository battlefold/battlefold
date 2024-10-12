import React from 'react'

type Cell = 'empty' | 'player-ship' | 'ai-ship' | 'player-hit' | 'ai-hit' | 'player-miss' | 'ai-miss' | 'both-miss' | 'both-hit' | 'player-footprint' | 'ai-footprint'
type Board = Cell[][]

interface GameBoardProps {
  board: Board
  aiBoard: Board
  handleCellClick: (x: number, y: number) => void
  gamePhase: string
  isPlayerTurn: boolean
  gameOver: boolean
  isAnimating: boolean
}

export default function GameBoard({
  board,
  aiBoard,
  handleCellClick,
  gamePhase,
  isPlayerTurn,
  gameOver,
  isAnimating
}: GameBoardProps) {
  const getCellColor = (playerCell: Cell, aiCell: Cell): string => {
    if (gamePhase === 'placement') {
      return playerCell === 'player-ship' ? 'bg-blue-500' : 'bg-[#EFE9E0]'
    } else {
      if (playerCell === 'both-hit' || aiCell === 'both-hit') return 'bg-gradient-to-r from-red-500 to-blue-500'
      if (playerCell === 'both-miss' || aiCell === 'both-miss') return 'bg-black'
      if (aiCell === 'player-hit') return 'bg-blue-500'
      if (playerCell === 'ai-hit') return 'bg-red-500'
      if (aiCell === 'player-miss') return 'bg-gray-300'
      if (playerCell === 'ai-miss') return 'bg-gray-100'
      if (aiCell === 'player-footprint') return 'bg-blue-300/30'
      if (playerCell === 'ai-footprint') return 'bg-red-300/30'
      return 'bg-[#EFE9E0]'
    }
  }

  return (
    <div className="grid grid-cols-6 gap-2" style={{ width: '300px', height: '300px' }}>
      {board.map((row, y) =>
        row.map((cell, x) => {
          const playerCell = board[y][x]
          const aiCell = aiBoard[y][x]
          return (
            <button
              key={`${x}-${y}`}
              className={`w-full h-full aspect-square ${getCellColor(playerCell, aiCell)} rounded-sm hover:opacity-75 transition-opacity`}
              onClick={() => handleCellClick(x, y)}
              disabled={gameOver || (!isPlayerTurn && gamePhase === 'battle') || gamePhase === 'countdown' || isAnimating}
            />
          )
        })
      )}
    </div>
  )
}
