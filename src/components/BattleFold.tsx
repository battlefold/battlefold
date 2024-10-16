"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import GameBoard from './GameBoard'
import PlayerStats from './PlayerStats'
import { Button } from "@/components/ui/button"
import ActionPopup from './ActionPopup'

const BOARD_SIZE = 6
const SHIP_COUNT = 3  // Changed from 2 to 3
const COUNTDOWN_TIME = 3  // Changed from 5 to 3
const ANIMATION_DURATION = 3500
const ANIMATION_INTERVAL = 150
const INITIAL_ROUND_MULTIPLIER = 60  // Changed from INITIAL_TURN_MULTIPLIER
const BASE_POINTS_HIT = 20
const BASE_POINTS_MISS = 1

type Cell = 'empty' | 'player-ship' | 'ai-ship' | 'player-hit' | 'ai-hit' | 'player-miss' | 'ai-miss' | 'both-miss' | 'both-hit' | 'player-footprint' | 'ai-footprint'
type Board = Cell[][]
type GamePhase = 'placement' | 'pre-countdown' | 'countdown' | 'battle' | 'result'
type Page = 'game' | 'ranking' | 'instructions'

const createEmptyBoard = (): Board => Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill('empty'))

const placeRandomShips = (board: Board, prefix: 'player' | 'ai'): Board => {
  const newBoard = board.map(row => [...row])
  let shipsPlaced = 0

  while (shipsPlaced < SHIP_COUNT) {
    const x = Math.floor(Math.random() * BOARD_SIZE)
    const y = Math.floor(Math.random() * BOARD_SIZE)
    if (newBoard[y][x] === 'empty') {
      newBoard[y][x] = `${prefix}-ship` as Cell
      shipsPlaced++
    }
  }

  return newBoard
}

interface BattleFoldProps {
  userName: string | null;
}

const BattleFold: React.FC<BattleFoldProps> = ({ userName }) => {
  const [playerBoard, setPlayerBoard] = useState<Board>(createEmptyBoard())
  const [aiBoard, setAiBoard] = useState<Board>(createEmptyBoard())
  const [playerShipsPlaced, setPlayerShipsPlaced] = useState(0)
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [gameOver, setGameOver] = useState(false)
  const [winner, setWinner] = useState<'player' | 'ai' | null>(null)
  const [message, setMessage] = useState<string>("Place your ships!")
  const [gamePhase, setGamePhase] = useState<GamePhase>('placement')
  const [countdown, setCountdown] = useState(COUNTDOWN_TIME)
  const [currentPage, setCurrentPage] = useState<Page>('game')
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationBoard, setAnimationBoard] = useState<Board>(createEmptyBoard())
  const [playerPoints, setPlayerPoints] = useState(0)
  const [aiPoints, setAiPoints] = useState(0)
  const [playerRoundMultiplier, setPlayerRoundMultiplier] = useState(INITIAL_ROUND_MULTIPLIER)
  const [aiRoundMultiplier, setAiRoundMultiplier] = useState(INITIAL_ROUND_MULTIPLIER)
  const [playerStreakMultiplier, setPlayerStreakMultiplier] = useState(1)  // Changed from playerStreak and initialized to 1
  const [aiStreakMultiplier, setAiStreakMultiplier] = useState(1)  // Changed from aiStreak and initialized to 1
  const [showClaimPointsPopup, setShowClaimPointsPopup] = useState(false)
  const [showCollectMapPopup, setShowCollectMapPopup] = useState(false)

  const router = useRouter()

  useEffect(() => {
    if (playerShipsPlaced === 0) {
      setMessage(userName ? `Place your ships, ${userName}!` : "Place your ships!")
    }
  }, [playerShipsPlaced, userName])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (gamePhase === 'countdown' && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    } else if (gamePhase === 'countdown' && countdown === 0) {
      setGamePhase('battle')
      setMessage("Battle begins! Start attacking!")
    }
    return () => clearTimeout(timer)
  }, [gamePhase, countdown])

  useEffect(() => {
    let animationTimer: NodeJS.Timeout
    if (gamePhase === 'result' && isAnimating) {
      const animate = () => {
        setAnimationBoard(prevBoard =>
          prevBoard.map(row =>
            row.map(() => getRandomCellColor())
          )
        )
      }

      animate() // Initial animation
      animationTimer = setInterval(animate, ANIMATION_INTERVAL)

      setTimeout(() => {
        clearInterval(animationTimer)
        setIsAnimating(false)
      }, ANIMATION_DURATION)
    }
    return () => clearInterval(animationTimer)
  }, [gamePhase, isAnimating])

  const calculatePoints = (isHit: boolean, streakMultiplier: number, roundMultiplier: number) => {
    const basePoints = isHit ? BASE_POINTS_HIT : BASE_POINTS_MISS
    return Math.round(basePoints * roundMultiplier * streakMultiplier)
  }

  const handleCellClick = (x: number, y: number) => {
    console.log('Cell clicked:', x, y);
    if (gameOver || !isPlayerTurn || gamePhase === 'countdown') return

    if (gamePhase === 'placement') {
      if (playerBoard[y][x] === 'empty' && playerShipsPlaced < SHIP_COUNT) {
        const newBoard = playerBoard.map(row => [...row])
        newBoard[y][x] = 'player-ship'
        setPlayerBoard(newBoard)
        const newShipsPlaced = playerShipsPlaced + 1
        setPlayerShipsPlaced(newShipsPlaced)
        if (newShipsPlaced === SHIP_COUNT) {
          setMessage("All ships placed. Preparing for battle!")
          setTimeout(() => {
            setAiBoard(placeRandomShips(createEmptyBoard(), 'ai'))
            setGamePhase('countdown')
          }, 1000)
        } else {
          setMessage(`Ship placed! (${newShipsPlaced}/${SHIP_COUNT})`)
        }
      } else if (playerShipsPlaced >= SHIP_COUNT) {
        setMessage(`You've already placed all ${SHIP_COUNT} ships!`)
      }
    } else {
      if (aiBoard[y][x] === 'player-hit' || aiBoard[y][x] === 'player-miss' || aiBoard[y][x] === 'both-miss' || aiBoard[y][x] === 'both-hit' || aiBoard[y][x] === 'player-footprint') {
        setMessage("You can't target this cell")
        return
      }

      console.log("playerBoard", playerBoard);
      console.log("aiBoard", aiBoard);

      const newPlayerBoard = playerBoard.map(row => [...row])
      const newAiBoard = aiBoard.map(row => [...row])

      let isHit = false
      if (newAiBoard[y][x] === 'ai-ship') {
        if (newPlayerBoard[y][x] === 'ai-hit') {
          newAiBoard[y][x] = 'both-hit'
          newPlayerBoard[y][x] = 'both-hit'
        } else {
          newAiBoard[y][x] = 'player-hit'
        }
        setMessage("Hit! Your turn again.")
        isHit = true
        setPlayerStreakMultiplier(prev => prev + 1)
      } else {
        if (newPlayerBoard[y][x] === 'ai-footprint') {
          newPlayerBoard[y][x] = 'both-miss'
          newAiBoard[y][x] = 'both-miss'
        } else {
          newAiBoard[y][x] = 'player-footprint'
        }
        setMessage("Miss! Enemy's turn.")
        setIsPlayerTurn(false)
        setPlayerStreakMultiplier(1)
      }

      console.log('isHit:', isHit);
      console.log('playerStreakMultiplier:', playerStreakMultiplier);
      console.log('playerRoundMultiplier:', playerRoundMultiplier);
      console.log('newPlayerBoard:', newPlayerBoard);
      console.log('newAiBoard:', newAiBoard);

      const points = calculatePoints(isHit, playerStreakMultiplier, playerRoundMultiplier)
      setPlayerPoints(prev => prev + points)
      setPlayerBoard(newPlayerBoard)
      setAiBoard(newAiBoard)
      setPlayerRoundMultiplier(prev => Math.max(prev - 1, 1))
      checkGameOver(newPlayerBoard, newAiBoard)
    }
  }

  const aiTurn = () => {
    console.log('AI turn!');

    console.log('playerBoard 1:', playerBoard);
    console.log('aiBoard: 1', aiBoard);


    const newPlayerBoard = playerBoard
    const newAiBoard = aiBoard

    console.log('newPlayerBoard: 2', newPlayerBoard);
    console.log('newAiBoard: 2', newAiBoard);
    let x, y
    do {
      x = Math.floor(Math.random() * BOARD_SIZE)
      y = Math.floor(Math.random() * BOARD_SIZE)
    } while (newPlayerBoard[y][x] === 'ai-hit' || newPlayerBoard[y][x] === 'ai-miss' || newPlayerBoard[y][x] === 'both-miss' || newPlayerBoard[y][x] === 'both-hit' || newPlayerBoard[y][x] === 'ai-footprint')

    console.log('ai selected x:', x);
    console.log('ai selected y:', y);

    let isHit = false
    if (newPlayerBoard[y][x] === 'player-ship') {
      if (newAiBoard[y][x] === 'player-hit') {

        console.log('AI hit a cell!');
        console.log('newPlayerBoard: 3 ', newPlayerBoard);
        console.log('newAiBoard: 3', newAiBoard);


        newPlayerBoard[y][x] = 'both-hit'
        newAiBoard[y][x] = 'both-hit'
      } else {
        newPlayerBoard[y][x] = 'ai-hit'
        setMessage("Enemy hit your ship! Enemy's turn again.")
        isHit = true
        setAiStreakMultiplier(prev => prev + 1)
      }

    } else {
      if (newAiBoard[y][x] === 'player-footprint') {
        newPlayerBoard[y][x] = 'both-miss'
        newAiBoard[y][x] = 'both-miss'
      } else {
        newPlayerBoard[y][x] = 'ai-footprint'
      }
      setMessage("Enemy missed. Your turn.")
      setAiStreakMultiplier(1)
    }

    const points = calculatePoints(isHit, aiStreakMultiplier, aiRoundMultiplier)
    setAiPoints(prev => prev + points)
    setPlayerBoard(newPlayerBoard)
    setAiBoard(newAiBoard)
    setAiRoundMultiplier(prev => Math.max(prev - 1, 1))
    checkGameOver(newPlayerBoard, newAiBoard)

    // If AI hit, schedule another turn
    if (isHit && !gameOver) {
      console.log('Scheduling AI turn in 1 second...');
      console.log('newPlayerBoard: 4', newPlayerBoard);
      console.log('newAiBoard: 4', newAiBoard);

      console.log('playerBoard: 5', playerBoard);
      console.log('aiBoard: 5', newAiBoard);

      const timer = setTimeout(aiTurn, 1000)
      return () => clearTimeout(timer)

    } else {
      setIsPlayerTurn(true) // Only set to player's turn if AI missed
    }
  }

  useEffect(() => {
    if (!isPlayerTurn && !gameOver && gamePhase === 'battle') {
      const timer = setTimeout(aiTurn, 1000)
      return () => clearTimeout(timer)
    }
  }, [isPlayerTurn, gameOver, gamePhase])

  const checkGameOver = (currentPlayerBoard: Board, currentAiBoard: Board) => {
    const playerShipsRemaining = currentPlayerBoard.flat().filter(cell => cell === 'player-ship').length
    const aiShipsRemaining = currentAiBoard.flat().filter(cell => cell === 'ai-ship').length

    if (playerShipsRemaining === 0 || aiShipsRemaining === 0) {
      setGameOver(true)
      setWinner(playerShipsRemaining === 0 ? 'ai' : 'player')
      setGamePhase('result')
      setIsAnimating(true)
      setAnimationBoard(currentPlayerBoard.map(row => row.map(() => getRandomCellColor())))
    }
  }

  const resetGame = () => {
    setPlayerBoard(createEmptyBoard())
    setAiBoard(createEmptyBoard())
    setPlayerShipsPlaced(0)
    setIsPlayerTurn(true)
    setGameOver(false)
    setWinner(null)
    setMessage("Place your ships!")
    setGamePhase('placement')
    setCountdown(COUNTDOWN_TIME)
    setIsAnimating(false)
    setAnimationBoard(createEmptyBoard())
    setPlayerPoints(0)
    setAiPoints(0)
    setPlayerRoundMultiplier(INITIAL_ROUND_MULTIPLIER)
    setAiRoundMultiplier(INITIAL_ROUND_MULTIPLIER)
    setPlayerStreakMultiplier(1)
    setAiStreakMultiplier(1)
  }

  const getRandomCellColor = (): Cell => {
    const colors: Cell[] = ['empty', 'player-ship', 'ai-ship', 'player-hit', 'ai-hit', 'player-miss', 'ai-miss', 'both-miss', 'player-footprint', 'ai-footprint']
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const handleSetCurrentPage = (page: Page) => {
    setCurrentPage(page)
    switch (page) {
      case 'game':
        router.push('/')
        break
      case 'ranking':
        router.push('/ranking')
        break
      case 'instructions':
        router.push('/instructions')
        break
    }
  }

  const handleClaimPoints = () => {
    console.log('Claim Points')
    setShowClaimPointsPopup(true)
  }

  const handleCollectMap = () => {
    console.log('Collect Map')
    setShowCollectMapPopup(true)
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-[#FBF7EF] pb-28 pt-14">
      <div className="flex flex-col items-center w-full max-w-[300px]">
        <h1 className="text-2xl font-bold mb-2">Play BattleFold</h1>
        <div className="mb-2 text-sm font-semibold h-6 w-full text-center">
          {gameOver
            ? winner === 'player' ? 'You win!' : 'Enemy wins!'
            : message
          }
        </div>
        <PlayerStats
          roundMultiplier={playerRoundMultiplier}
          streakMultiplier={playerStreakMultiplier}
          playerPoints={playerPoints}
          aiPoints={aiPoints}
        />
        {gamePhase === 'countdown' ? (
          <div className="text-6xl font-bold mb-4 h-[300px] w-full flex items-center justify-center">
            {countdown}
          </div>
        ) : (
          <>
            <GameBoard
              board={gamePhase === 'result' && isAnimating ? animationBoard : playerBoard}
              aiBoard={aiBoard}
              handleCellClick={handleCellClick}
              gamePhase={gamePhase}
              isPlayerTurn={isPlayerTurn}
              gameOver={gameOver}
              isAnimating={isAnimating}
            />
            {gamePhase === 'battle' && (
              <Button
                onClick={resetGame}
                className="mt-4 px-4 py-1 text-sm font-normal bg-gray-200 text-gray-700 hover:bg-gray-300 w-full"
              >
                New Game
              </Button>
            )}
          </>
        )}
        {gamePhase === 'result' && !isAnimating && (
          <div className="mt-4 text-center w-full">
            <div className="space-y-2">
              <div className="flex space-x-2">
                <Button onClick={handleClaimPoints} className="flex-1 bg-yellow-500 hover:bg-yellow-600">
                  Claim Points
                </Button>
                <Button onClick={handleCollectMap} className="flex-1 bg-blue-500 hover:bg-blue-600">
                  Collect Map
                </Button>
              </div>
              <Button onClick={resetGame} className="w-full mt-4">New Game</Button>
            </div>
          </div>
        )}
        {showClaimPointsPopup && (
          <ActionPopup
            title="Points Claimed!"
            message={`You've successfully claimed ${playerPoints} points.`}
            onClose={() => setShowClaimPointsPopup(false)}
          />
        )}
        {showCollectMapPopup && (
          <ActionPopup
            title="Map Collected!"
            message="You've successfully collected a new map piece."
            onClose={() => setShowCollectMapPopup(false)}
          />
        )}
      </div>
    </div>
  )
}

export default BattleFold