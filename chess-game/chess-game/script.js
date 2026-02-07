/**
 * Chess Master - Two Player Chess Game
 * Complete chess implementation with all rules, special moves, and UI
 */

// ===== PIECE DEFINITIONS =====
const PIECES = {
    white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
    black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' }
};

const PIECE_VALUES = { pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9, king: 0 };

// ===== GAME STATE =====
let gameState = {
    board: [],
    currentTurn: 'white',
    selectedSquare: null,
    validMoves: [],
    moveHistory: [],
    capturedPieces: { white: [], black: [] },
    lastMove: null,
    enPassantTarget: null,
    isCheck: false,
    isCheckmate: false,
    isStalemate: false,
    gameOver: false,
    pendingPromotion: null
};

// ===== DOM ELEMENTS =====
const elements = {
    chessboard: document.getElementById('chessboard'),
    turnIndicator: document.getElementById('turn-indicator'),
    gameStatus: document.getElementById('game-status'),
    moveHistory: document.getElementById('move-history'),
    capturedBlack: document.getElementById('captured-black'),
    capturedWhite: document.getElementById('captured-white'),
    advantageWhite: document.getElementById('advantage-white'),
    advantageBlack: document.getElementById('advantage-black'),
    btnNewGame: document.getElementById('btn-new-game'),
    btnUndo: document.getElementById('btn-undo'),
    gameOverModal: document.getElementById('game-over-modal'),
    modalIcon: document.getElementById('modal-icon'),
    modalTitle: document.getElementById('modal-title'),
    modalMessage: document.getElementById('modal-message'),
    btnPlayAgain: document.getElementById('btn-play-again'),
    promotionModal: document.getElementById('promotion-modal'),
    promotionOptions: document.getElementById('promotion-options'),
    toast: document.getElementById('invalid-move-toast'),
    toastMessage: document.getElementById('toast-message')
};

// ===== INITIALIZATION =====
function initGame() {
    gameState = {
        board: createInitialBoard(),
        currentTurn: 'white',
        selectedSquare: null,
        validMoves: [],
        moveHistory: [],
        capturedPieces: { white: [], black: [] },
        lastMove: null,
        enPassantTarget: null,
        isCheck: false,
        isCheckmate: false,
        isStalemate: false,
        gameOver: false,
        pendingPromotion: null
    };
    
    renderBoard();
    updateUI();
    hideModal();
}

function createInitialBoard() {
    const board = Array(8).fill(null).map(() => Array(8).fill(null));
    
    // Black pieces (top)
    board[0][0] = { type: 'rook', color: 'black', hasMoved: false };
    board[0][1] = { type: 'knight', color: 'black', hasMoved: false };
    board[0][2] = { type: 'bishop', color: 'black', hasMoved: false };
    board[0][3] = { type: 'queen', color: 'black', hasMoved: false };
    board[0][4] = { type: 'king', color: 'black', hasMoved: false };
    board[0][5] = { type: 'bishop', color: 'black', hasMoved: false };
    board[0][6] = { type: 'knight', color: 'black', hasMoved: false };
    board[0][7] = { type: 'rook', color: 'black', hasMoved: false };
    for (let i = 0; i < 8; i++) {
        board[1][i] = { type: 'pawn', color: 'black', hasMoved: false };
    }
    
    // White pieces (bottom)
    board[7][0] = { type: 'rook', color: 'white', hasMoved: false };
    board[7][1] = { type: 'knight', color: 'white', hasMoved: false };
    board[7][2] = { type: 'bishop', color: 'white', hasMoved: false };
    board[7][3] = { type: 'queen', color: 'white', hasMoved: false };
    board[7][4] = { type: 'king', color: 'white', hasMoved: false };
    board[7][5] = { type: 'bishop', color: 'white', hasMoved: false };
    board[7][6] = { type: 'knight', color: 'white', hasMoved: false };
    board[7][7] = { type: 'rook', color: 'white', hasMoved: false };
    for (let i = 0; i < 8; i++) {
        board[6][i] = { type: 'pawn', color: 'white', hasMoved: false };
    }
    
    return board;
}

// ===== BOARD RENDERING =====
function renderBoard() {
    elements.chessboard.innerHTML = '';
    
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            const isLight = (row + col) % 2 === 0;
            square.className = `square ${isLight ? 'light' : 'dark'}`;
            square.dataset.row = row;
            square.dataset.col = col;
            
            // Add last move highlight
            if (gameState.lastMove) {
                const { from, to } = gameState.lastMove;
                if ((row === from.row && col === from.col) || (row === to.row && col === to.col)) {
                    square.classList.add('last-move');
                }
            }
            
            // Add piece
            const piece = gameState.board[row][col];
            if (piece) {
                const pieceEl = document.createElement('span');
                pieceEl.className = `piece ${piece.color}`;
                pieceEl.textContent = PIECES[piece.color][piece.type];
                
                // Highlight king in check
                if (piece.type === 'king' && piece.color === gameState.currentTurn && gameState.isCheck) {
                    square.classList.add('in-check');
                }
                
                square.appendChild(pieceEl);
            }
            
            // Add valid move indicators
            if (gameState.selectedSquare) {
                const move = gameState.validMoves.find(m => m.row === row && m.col === col);
                if (move) {
                    if (move.isCapture || move.isEnPassant) {
                        square.classList.add('capture-move');
                    } else {
                        square.classList.add('valid-move');
                    }
                }
                
                // Highlight selected square
                if (gameState.selectedSquare.row === row && gameState.selectedSquare.col === col) {
                    square.classList.add('selected');
                }
            }
            
            square.addEventListener('click', () => handleSquareClick(row, col));
            elements.chessboard.appendChild(square);
        }
    }
}

// ===== MOVE VALIDATION =====
function getValidMoves(row, col, checkKingSafety = true) {
    const piece = gameState.board[row][col];
    if (!piece) return [];
    
    let moves = [];
    
    switch (piece.type) {
        case 'pawn': moves = getPawnMoves(row, col, piece); break;
        case 'rook': moves = getRookMoves(row, col, piece); break;
        case 'knight': moves = getKnightMoves(row, col, piece); break;
        case 'bishop': moves = getBishopMoves(row, col, piece); break;
        case 'queen': moves = getQueenMoves(row, col, piece); break;
        case 'king': moves = getKingMoves(row, col, piece, checkKingSafety); break;
    }
    
    // Filter moves that would leave king in check
    if (checkKingSafety) {
        moves = moves.filter(move => !wouldBeInCheck(row, col, move.row, move.col, piece.color));
    }
    
    return moves;
}

function getPawnMoves(row, col, piece) {
    const moves = [];
    const direction = piece.color === 'white' ? -1 : 1;
    const startRow = piece.color === 'white' ? 6 : 1;
    
    // Forward move
    if (isValidSquare(row + direction, col) && !gameState.board[row + direction][col]) {
        moves.push({ row: row + direction, col, isCapture: false });
        
        // Double move from start
        if (row === startRow && !gameState.board[row + 2 * direction][col]) {
            moves.push({ row: row + 2 * direction, col, isCapture: false, isDoublePawn: true });
        }
    }
    
    // Captures
    [-1, 1].forEach(dcol => {
        const newCol = col + dcol;
        if (isValidSquare(row + direction, newCol)) {
            const target = gameState.board[row + direction][newCol];
            if (target && target.color !== piece.color) {
                moves.push({ row: row + direction, col: newCol, isCapture: true });
            }
        }
    });
    
    // En passant
    if (gameState.enPassantTarget) {
        const { row: epRow, col: epCol } = gameState.enPassantTarget;
        if (row + direction === epRow && Math.abs(col - epCol) === 1) {
            moves.push({ row: epRow, col: epCol, isCapture: true, isEnPassant: true });
        }
    }
    
    return moves;
}

function getRookMoves(row, col, piece) {
    const moves = [];
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    
    directions.forEach(([drow, dcol]) => {
        let newRow = row + drow;
        let newCol = col + dcol;
        
        while (isValidSquare(newRow, newCol)) {
            const target = gameState.board[newRow][newCol];
            if (!target) {
                moves.push({ row: newRow, col: newCol, isCapture: false });
            } else {
                if (target.color !== piece.color) {
                    moves.push({ row: newRow, col: newCol, isCapture: true });
                }
                break;
            }
            newRow += drow;
            newCol += dcol;
        }
    });
    
    return moves;
}

function getKnightMoves(row, col, piece) {
    const moves = [];
    const offsets = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
    
    offsets.forEach(([drow, dcol]) => {
        const newRow = row + drow;
        const newCol = col + dcol;
        
        if (isValidSquare(newRow, newCol)) {
            const target = gameState.board[newRow][newCol];
            if (!target || target.color !== piece.color) {
                moves.push({ row: newRow, col: newCol, isCapture: !!target });
            }
        }
    });
    
    return moves;
}

function getBishopMoves(row, col, piece) {
    const moves = [];
    const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
    
    directions.forEach(([drow, dcol]) => {
        let newRow = row + drow;
        let newCol = col + dcol;
        
        while (isValidSquare(newRow, newCol)) {
            const target = gameState.board[newRow][newCol];
            if (!target) {
                moves.push({ row: newRow, col: newCol, isCapture: false });
            } else {
                if (target.color !== piece.color) {
                    moves.push({ row: newRow, col: newCol, isCapture: true });
                }
                break;
            }
            newRow += drow;
            newCol += dcol;
        }
    });
    
    return moves;
}

function getQueenMoves(row, col, piece) {
    return [...getRookMoves(row, col, piece), ...getBishopMoves(row, col, piece)];
}

function getKingMoves(row, col, piece, checkCastling = true) {
    const moves = [];
    const directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    
    directions.forEach(([drow, dcol]) => {
        const newRow = row + drow;
        const newCol = col + dcol;
        
        if (isValidSquare(newRow, newCol)) {
            const target = gameState.board[newRow][newCol];
            if (!target || target.color !== piece.color) {
                moves.push({ row: newRow, col: newCol, isCapture: !!target });
            }
        }
    });
    
    // Castling
    if (checkCastling && !piece.hasMoved && !isKingInCheck(piece.color)) {
        // Kingside
        if (canCastle(row, col, 7, piece.color)) {
            moves.push({ row, col: col + 2, isCapture: false, isCastling: 'kingside' });
        }
        // Queenside
        if (canCastle(row, col, 0, piece.color)) {
            moves.push({ row, col: col - 2, isCapture: false, isCastling: 'queenside' });
        }
    }
    
    return moves;
}

function canCastle(kingRow, kingCol, rookCol, color) {
    const rook = gameState.board[kingRow][rookCol];
    if (!rook || rook.type !== 'rook' || rook.hasMoved) return false;
    
    const step = rookCol > kingCol ? 1 : -1;
    const endCol = rookCol > kingCol ? kingCol + 2 : kingCol - 2;
    
    // Check if path is clear
    for (let col = kingCol + step; col !== rookCol; col += step) {
        if (gameState.board[kingRow][col]) return false;
    }
    
    // Check if king passes through or lands on attacked square
    for (let col = kingCol; col !== endCol + step; col += step) {
        if (isSquareAttacked(kingRow, col, color === 'white' ? 'black' : 'white')) {
            return false;
        }
    }
    
    return true;
}

function isValidSquare(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}

function isSquareAttacked(row, col, byColor) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = gameState.board[r][c];
            if (piece && piece.color === byColor) {
                const moves = getValidMoves(r, c, false);
                if (moves.some(m => m.row === row && m.col === col)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function findKing(color) {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = gameState.board[row][col];
            if (piece && piece.type === 'king' && piece.color === color) {
                return { row, col };
            }
        }
    }
    return null;
}

function isKingInCheck(color) {
    const kingPos = findKing(color);
    if (!kingPos) return false;
    const enemyColor = color === 'white' ? 'black' : 'white';
    return isSquareAttacked(kingPos.row, kingPos.col, enemyColor);
}

function wouldBeInCheck(fromRow, fromCol, toRow, toCol, color) {
    // Simulate move
    const originalPiece = gameState.board[toRow][toCol];
    const movingPiece = gameState.board[fromRow][fromCol];
    
    gameState.board[toRow][toCol] = movingPiece;
    gameState.board[fromRow][fromCol] = null;
    
    // Handle en passant capture simulation
    let enPassantCapture = null;
    if (movingPiece.type === 'pawn' && gameState.enPassantTarget &&
        toRow === gameState.enPassantTarget.row && toCol === gameState.enPassantTarget.col) {
        const captureRow = color === 'white' ? toRow + 1 : toRow - 1;
        enPassantCapture = gameState.board[captureRow][toCol];
        gameState.board[captureRow][toCol] = null;
    }
    
    const inCheck = isKingInCheck(color);
    
    // Restore
    gameState.board[fromRow][fromCol] = movingPiece;
    gameState.board[toRow][toCol] = originalPiece;
    
    if (enPassantCapture) {
        const captureRow = color === 'white' ? toRow + 1 : toRow - 1;
        gameState.board[captureRow][toCol] = enPassantCapture;
    }
    
    return inCheck;
}

function hasAnyLegalMoves(color) {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = gameState.board[row][col];
            if (piece && piece.color === color) {
                const moves = getValidMoves(row, col, true);
                if (moves.length > 0) return true;
            }
        }
    }
    return false;
}

// ===== MOVE EXECUTION =====
function handleSquareClick(row, col) {
    if (gameState.gameOver || gameState.pendingPromotion) return;
    
    const piece = gameState.board[row][col];
    
    // If a piece is selected
    if (gameState.selectedSquare) {
        const { row: fromRow, col: fromCol } = gameState.selectedSquare;
        
        // Clicking same square - deselect
        if (fromRow === row && fromCol === col) {
            deselectPiece();
            return;
        }
        
        // Try to move
        const move = gameState.validMoves.find(m => m.row === row && m.col === col);
        if (move) {
            executeMove(fromRow, fromCol, row, col, move);
            return;
        }
        
        // Clicking on own piece - select it instead
        if (piece && piece.color === gameState.currentTurn) {
            selectPiece(row, col);
            return;
        }
        
        // Invalid move - show feedback
        showInvalidMove(row, col);
        return;
    }
    
    // Select piece if it's current player's
    if (piece && piece.color === gameState.currentTurn) {
        selectPiece(row, col);
    }
}

function selectPiece(row, col) {
    gameState.selectedSquare = { row, col };
    gameState.validMoves = getValidMoves(row, col, true);
    renderBoard();
}

function deselectPiece() {
    gameState.selectedSquare = null;
    gameState.validMoves = [];
    renderBoard();
}

function executeMove(fromRow, fromCol, toRow, toCol, moveInfo) {
    const piece = gameState.board[fromRow][fromCol];
    const capturedPiece = gameState.board[toRow][toCol];
    
    // Store move for history
    const moveData = {
        piece: { ...piece },
        from: { row: fromRow, col: fromCol },
        to: { row: toRow, col: toCol },
        captured: capturedPiece ? { ...capturedPiece } : null,
        isCastling: moveInfo.isCastling,
        isEnPassant: moveInfo.isEnPassant,
        isDoublePawn: moveInfo.isDoublePawn,
        wasCheck: gameState.isCheck,
        previousEnPassant: gameState.enPassantTarget
    };
    
    // Handle capture
    if (capturedPiece) {
        gameState.capturedPieces[capturedPiece.color].push(capturedPiece);
    }
    
    // Handle en passant capture
    if (moveInfo.isEnPassant) {
        const captureRow = piece.color === 'white' ? toRow + 1 : toRow - 1;
        const epPiece = gameState.board[captureRow][toCol];
        moveData.enPassantCapture = { piece: epPiece, row: captureRow, col: toCol };
        gameState.capturedPieces[epPiece.color].push(epPiece);
        gameState.board[captureRow][toCol] = null;
    }
    
    // Move piece
    gameState.board[toRow][toCol] = piece;
    gameState.board[fromRow][fromCol] = null;
    piece.hasMoved = true;
    
    // Handle castling
    if (moveInfo.isCastling) {
        const rookCol = moveInfo.isCastling === 'kingside' ? 7 : 0;
        const newRookCol = moveInfo.isCastling === 'kingside' ? toCol - 1 : toCol + 1;
        const rook = gameState.board[fromRow][rookCol];
        gameState.board[fromRow][newRookCol] = rook;
        gameState.board[fromRow][rookCol] = null;
        rook.hasMoved = true;
        moveData.rookMove = { from: rookCol, to: newRookCol };
    }
    
    // Set en passant target
    gameState.enPassantTarget = null;
    if (moveInfo.isDoublePawn) {
        const epRow = piece.color === 'white' ? toRow + 1 : toRow - 1;
        gameState.enPassantTarget = { row: epRow, col: toCol };
    }
    
    // Check for pawn promotion
    if (piece.type === 'pawn' && (toRow === 0 || toRow === 7)) {
        gameState.pendingPromotion = { row: toRow, col: toCol, moveData };
        showPromotionModal(piece.color);
        return;
    }
    
    finishMove(moveData);
}

function finishMove(moveData) {
    // Add algebraic notation
    moveData.notation = getMoveNotation(moveData);
    gameState.moveHistory.push(moveData);
    
    // Update last move
    gameState.lastMove = { from: moveData.from, to: moveData.to };
    
    // Switch turns
    gameState.currentTurn = gameState.currentTurn === 'white' ? 'black' : 'white';
    
    // Check game state
    gameState.isCheck = isKingInCheck(gameState.currentTurn);
    
    if (!hasAnyLegalMoves(gameState.currentTurn)) {
        if (gameState.isCheck) {
            gameState.isCheckmate = true;
            gameState.gameOver = true;
            moveData.notation += '#';
        } else {
            gameState.isStalemate = true;
            gameState.gameOver = true;
        }
    } else if (gameState.isCheck) {
        moveData.notation += '+';
    }
    
    deselectPiece();
    updateUI();
    
    if (gameState.gameOver) {
        showGameOverModal();
    }
}

// ===== PROMOTION =====
function showPromotionModal(color) {
    const options = ['queen', 'rook', 'bishop', 'knight'];
    elements.promotionOptions.innerHTML = '';
    
    options.forEach(type => {
        const btn = document.createElement('button');
        btn.className = `promotion-option ${color}`;
        btn.textContent = PIECES[color][type];
        btn.onclick = () => handlePromotion(type);
        elements.promotionOptions.appendChild(btn);
    });
    
    elements.promotionModal.classList.remove('hidden');
}

function handlePromotion(pieceType) {
    const { row, col, moveData } = gameState.pendingPromotion;
    
    // Change piece
    gameState.board[row][col] = {
        type: pieceType,
        color: gameState.board[row][col].color,
        hasMoved: true
    };
    
    moveData.promotion = pieceType;
    gameState.pendingPromotion = null;
    elements.promotionModal.classList.add('hidden');
    
    finishMove(moveData);
}

// ===== ALGEBRAIC NOTATION =====
function getMoveNotation(moveData) {
    const { piece, from, to, captured, isCastling, isEnPassant, promotion } = moveData;
    
    if (isCastling === 'kingside') return 'O-O';
    if (isCastling === 'queenside') return 'O-O-O';
    
    const files = 'abcdefgh';
    const ranks = '87654321';
    
    let notation = '';
    
    if (piece.type !== 'pawn') {
        notation += piece.type.charAt(0).toUpperCase();
        if (piece.type === 'knight') notation = 'N';
    }
    
    // Disambiguation (simplified)
    if (piece.type !== 'pawn' && piece.type !== 'king') {
        const similarPieces = findSimilarPieces(piece, to.row, to.col, from);
        if (similarPieces.length > 0) {
            const sameFile = similarPieces.some(p => p.col === from.col);
            const sameRank = similarPieces.some(p => p.row === from.row);
            if (!sameFile) {
                notation += files[from.col];
            } else if (!sameRank) {
                notation += ranks[from.row];
            } else {
                notation += files[from.col] + ranks[from.row];
            }
        }
    }
    
    // Pawn capture includes file
    if (piece.type === 'pawn' && (captured || isEnPassant)) {
        notation += files[from.col];
    }
    
    // Capture
    if (captured || isEnPassant) notation += 'x';
    
    // Destination
    notation += files[to.col] + ranks[to.row];
    
    // En passant
    if (isEnPassant) notation += ' e.p.';
    
    // Promotion
    if (promotion) {
        notation += '=' + (promotion === 'knight' ? 'N' : promotion.charAt(0).toUpperCase());
    }
    
    return notation;
}

function findSimilarPieces(piece, toRow, toCol, excludePos) {
    const pieces = [];
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (row === excludePos.row && col === excludePos.col) continue;
            const p = gameState.board[row][col];
            if (p && p.type === piece.type && p.color === piece.color) {
                const moves = getValidMoves(row, col, true);
                if (moves.some(m => m.row === toRow && m.col === toCol)) {
                    pieces.push({ row, col });
                }
            }
        }
    }
    return pieces;
}

// ===== UNDO =====
function undoMove() {
    if (gameState.moveHistory.length === 0 || gameState.pendingPromotion) return;
    
    const moveData = gameState.moveHistory.pop();
    
    // Restore piece to original position
    gameState.board[moveData.from.row][moveData.from.col] = moveData.piece;
    moveData.piece.hasMoved = moveData.piece.hasMoved; // Note: This is simplified, full undo would track original hasMoved
    
    // Handle promotion undo
    if (moveData.promotion) {
        gameState.board[moveData.from.row][moveData.from.col] = {
            type: 'pawn',
            color: moveData.piece.color,
            hasMoved: true
        };
    }
    
    // Restore captured piece or clear destination
    if (moveData.captured) {
        gameState.board[moveData.to.row][moveData.to.col] = moveData.captured;
        const idx = gameState.capturedPieces[moveData.captured.color].length - 1;
        gameState.capturedPieces[moveData.captured.color].splice(idx, 1);
    } else {
        gameState.board[moveData.to.row][moveData.to.col] = null;
    }
    
    // Handle en passant undo
    if (moveData.isEnPassant && moveData.enPassantCapture) {
        const { row, col, piece } = moveData.enPassantCapture;
        gameState.board[row][col] = piece;
        const idx = gameState.capturedPieces[piece.color].length - 1;
        gameState.capturedPieces[piece.color].splice(idx, 1);
    }
    
    // Handle castling undo
    if (moveData.isCastling) {
        const rookFromCol = moveData.rookMove.to;
        const rookToCol = moveData.rookMove.from;
        const rook = gameState.board[moveData.from.row][rookFromCol];
        gameState.board[moveData.from.row][rookToCol] = rook;
        gameState.board[moveData.from.row][rookFromCol] = null;
        rook.hasMoved = false;
        moveData.piece.hasMoved = false;
    }
    
    // Restore en passant target
    gameState.enPassantTarget = moveData.previousEnPassant;
    
    // Switch turn back
    gameState.currentTurn = gameState.currentTurn === 'white' ? 'black' : 'white';
    
    // Restore last move
    if (gameState.moveHistory.length > 0) {
        const prevMove = gameState.moveHistory[gameState.moveHistory.length - 1];
        gameState.lastMove = { from: prevMove.from, to: prevMove.to };
    } else {
        gameState.lastMove = null;
    }
    
    // Reset game state
    gameState.isCheck = moveData.wasCheck;
    gameState.isCheckmate = false;
    gameState.isStalemate = false;
    gameState.gameOver = false;
    
    deselectPiece();
    updateUI();
    hideModal();
}

// ===== UI UPDATES =====
function updateUI() {
    updateTurnIndicator();
    updateGameStatus();
    updateMoveHistory();
    updateCapturedPieces();
    updateButtons();
}

function updateTurnIndicator() {
    const isWhite = gameState.currentTurn === 'white';
    elements.turnIndicator.className = `turn-indicator ${isWhite ? 'white-turn' : 'black-turn'}`;
    elements.turnIndicator.querySelector('.turn-piece').textContent = isWhite ? '♔' : '♚';
    elements.turnIndicator.querySelector('.turn-text').textContent = `${isWhite ? "White" : "Black"}'s Turn`;
}

function updateGameStatus() {
    elements.gameStatus.className = 'game-status';
    
    if (gameState.isCheckmate) {
        const winner = gameState.currentTurn === 'white' ? 'Black' : 'White';
        elements.gameStatus.textContent = `Checkmate! ${winner} wins!`;
        elements.gameStatus.classList.add('checkmate');
    } else if (gameState.isStalemate) {
        elements.gameStatus.textContent = 'Stalemate! Draw!';
        elements.gameStatus.classList.add('stalemate');
    } else if (gameState.isCheck) {
        elements.gameStatus.textContent = 'Check!';
        elements.gameStatus.classList.add('check');
    }
}

function updateMoveHistory() {
    elements.moveHistory.innerHTML = '';
    
    for (let i = 0; i < gameState.moveHistory.length; i += 2) {
        const moveNumber = Math.floor(i / 2) + 1;
        const whiteMove = gameState.moveHistory[i];
        const blackMove = gameState.moveHistory[i + 1];
        
        const entry = document.createElement('div');
        entry.className = 'move-entry';
        entry.innerHTML = `
            <span class="move-number">${moveNumber}.</span>
            <span class="move-white">${whiteMove.notation}</span>
            <span class="move-black">${blackMove ? blackMove.notation : ''}</span>
        `;
        elements.moveHistory.appendChild(entry);
    }
    
    elements.moveHistory.scrollTop = elements.moveHistory.scrollHeight;
}

function updateCapturedPieces() {
    // Black pieces captured by white
    elements.capturedBlack.innerHTML = gameState.capturedPieces.black
        .map(p => `<span class="captured-piece">${PIECES.black[p.type]}</span>`).join('');
    
    // White pieces captured by black
    elements.capturedWhite.innerHTML = gameState.capturedPieces.white
        .map(p => `<span class="captured-piece">${PIECES.white[p.type]}</span>`).join('');
    
    // Material advantage
    const whiteValue = gameState.capturedPieces.black.reduce((sum, p) => sum + PIECE_VALUES[p.type], 0);
    const blackValue = gameState.capturedPieces.white.reduce((sum, p) => sum + PIECE_VALUES[p.type], 0);
    const diff = whiteValue - blackValue;
    
    elements.advantageWhite.textContent = diff > 0 ? `+${diff}` : '';
    elements.advantageBlack.textContent = diff < 0 ? `+${Math.abs(diff)}` : '';
}

function updateButtons() {
    elements.btnUndo.disabled = gameState.moveHistory.length === 0;
}

// ===== MODALS & TOASTS =====
function showGameOverModal() {
    if (gameState.isCheckmate) {
        const winner = gameState.currentTurn === 'white' ? 'Black' : 'White';
        elements.modalIcon.textContent = winner === 'White' ? '♔' : '♚';
        elements.modalTitle.textContent = 'Checkmate!';
        elements.modalMessage.textContent = `${winner} wins the game!`;
    } else {
        elements.modalIcon.textContent = '🤝';
        elements.modalTitle.textContent = 'Stalemate!';
        elements.modalMessage.textContent = 'The game is a draw.';
    }
    elements.gameOverModal.classList.remove('hidden');
}

function hideModal() {
    elements.gameOverModal.classList.add('hidden');
    elements.promotionModal.classList.add('hidden');
}

function showInvalidMove(row, col) {
    const squares = elements.chessboard.querySelectorAll('.square');
    const squareIndex = row * 8 + col;
    const square = squares[squareIndex];
    
    square.classList.add('invalid-shake');
    setTimeout(() => square.classList.remove('invalid-shake'), 400);
    
    showToast('Invalid move!');
}

function showToast(message) {
    elements.toastMessage.textContent = message;
    elements.toast.classList.remove('hidden');
    
    setTimeout(() => {
        elements.toast.classList.add('hidden');
    }, 2000);
}

// ===== EVENT LISTENERS =====
elements.btnNewGame.addEventListener('click', initGame);
elements.btnUndo.addEventListener('click', undoMove);
elements.btnPlayAgain.addEventListener('click', initGame);

// ===== START GAME =====
initGame();
