import React, { useEffect, useState } from 'react'
import { Easy, Expert, Hard, Master, Medium, MySudoku } from '../Data';
import "../styles/Sudoku.css"

const getDeepCopy = (arr) => {
    return JSON.parse(JSON.stringify(arr))
}

const Sudoko = () => {
    const [gridIndex, setGridIndex] = useState(0);
    const [difficultyLevel, setDifficultyLevel] = useState(Easy);
    const initialGrid = difficultyLevel[gridIndex];
    const [sudokuArr, setsudokuArr] = useState(getDeepCopy(initialGrid));
    const [resetOff, setResetOff] = useState(false);
    const [undoStack, setUndoStack] = useState([]);
    const [mysuduCL, setMysuduCL] = useState(true);
    const [mysuduFinish, setMysuduFinish] = useState(true);

    useEffect(() => {
        let sudoku = getDeepCopy(initialGrid);
        setsudokuArr(sudoku);
    }, [initialGrid])

    const onInputChange = (e, row, col) => {
        var val = parseInt(e.target.value) || 0, grid = getDeepCopy(sudokuArr)
        //input value should be range from 1-9 and for empty cell it should be 0
        // eslint-disable-next-line no-mixed-operators
        if (val === 0 || val >= 1 && val <= 9) {
            grid[row][col] = val;
        }
        setsudokuArr(grid)
        setUndoStack((prevStack) => [...prevStack, sudokuArr]);
    }

    // ===================== solving ============

    function solveSudoku(grid) {
        const N = grid.length;

        // Find an empty location in the grid
        const findEmptyLocation = () => {
            for (let row = 0; row < N; row++) {
                for (let col = 0; col < N; col++) {
                    if (grid[row][col] === 0) {
                        return [row, col];
                    }
                }
            }
            return null; // No empty location found
        };

        // Check if a number can be placed in a particular cell
        const isSafe = (row, col, num) => {
            // Check the row
            for (let i = 0; i < N; i++) {
                if (grid[row][i] === num) {
                    return false;
                }
            }

            // Check the column
            for (let i = 0; i < N; i++) {
                if (grid[i][col] === num) {
                    return false;
                }
            }

            // Check the 3x3 subgrid
            const startRow = row - (row % 3);
            const startCol = col - (col % 3);
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (grid[startRow + i][startCol + j] === num) {
                        return false;
                    }
                }
            }

            return true; // The number can be placed in this cell
        };

        // Solve the Sudoku puzzle using backtracking
        const solve = () => {
            const emptyLocation = findEmptyLocation();
            if (!emptyLocation) {
                return true; // Puzzle solved
            }

            const [row, col] = emptyLocation;

            for (let num = 1; num <= N; num++) {
                if (isSafe(row, col, num)) {
                    grid[row][col] = num;

                    if (solve()) {
                        return true; // If placing the number leads to a solution, return true
                    }

                    grid[row][col] = 0; // If placing the number doesn't lead to a solution, backtrack
                }
            }

            return false; // No number can be placed in this cell
        };

        // Start the solving process
        if (solve()) {
            return grid; // Return the solved grid
        } else {
            return null; // No solution exists
        }
    }

    //function solve sudoku navigating to each cell
    const solveHandleButton = () => {
        const solvedGrid = solveSudoku(initialGrid);
        setResetOff(true)
        if (solvedGrid) {
            setsudokuArr(solvedGrid);
            console.log("Sudoku Solved!");
        } else {
            console.log("No solution exists.");
        }
    }

    // ========== function to compare sudoku's ==========
    const campareSudokus = (currentSudoku, solvedSudoku) => {
        let res = {
            isComplete: true,
            isSolvable: true
        }
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                if (currentSudoku[i][j] !== solvedSudoku[i][j]) {
                    if (currentSudoku[i][j] !== 0) {
                        res.isSolvable = false;
                    }
                    res.isComplete = false;
                }
            }
        }
        return res
    }

    //function to chack sudoku is valid or not
    const checkHandleButton = () => {
        let sudoku = getDeepCopy(initialGrid);
        solveSudoku(sudoku);
        let compare = campareSudokus(sudokuArr, sudoku)
        if (compare?.isComplete) {
            alert('Congratualtion! You have solved Sudoku!')
        } else if (compare?.isSolvable) {
            alert("Keep Going...!")
        } else {
            setResetOff(false)
            alert("Sudoku can't be solved,Try again!")
        }
    }

    // ======= function reset sudoko ========= 
    const resetHandleButton = () => {
        let sudoku = getDeepCopy(initialGrid)
        setsudokuArr(sudoku)
    }

    // ========= Next Sudoko Game ========
    const nextHandleButton = () => {
        setGridIndex((prevIndex) => (prevIndex + 1) % difficultyLevel.length);
        setResetOff(false) // Reset correctness status
        setUndoStack([]);
        // setIsNextGame(!isNextGame)
        // setCurrentStep((prevState) => prevState + 1)
    }

    // ========= UNDO ===================== 
    const undo = () => {
        if (undoStack.length > 0) {
            const prevGrid = undoStack[undoStack.length - 1];
            setUndoStack(undoStack.slice(0, -1));
            setsudokuArr(prevGrid);
        }
    };

    //========== LEVEL =============
    const Difficulty = (difficulty) => {
        setMysuduCL(true)
        setGridIndex(0);
        setUndoStack([]);
        if (difficulty === 'easy') {
            setDifficultyLevel(Easy)
        } else if (difficulty === 'medium') {
            setDifficultyLevel(Medium)
        } else if (difficulty === 'hard') {
            setDifficultyLevel(Hard)
        } else if (difficulty === 'expert') {
            setDifficultyLevel(Expert)
        } else if (difficulty === 'master') {
            setDifficultyLevel(Master)
        } else {
            setDifficultyLevel(Easy)
        }
    }

    //========= My Sudoku ===========
    const MySudokuPuzzle = () => {
        setsudokuArr(MySudoku[0])
        setGridIndex(0);
        setDifficultyLevel(MySudoku)
        setMysuduCL(false)
    }

    const MySudokuSubmit = () => {
        solveSudoku(sudokuArr);
        // setMysuduCL(true)
        setResetOff(false)
        setMysuduFinish(false)
    }

    const TryAgainMySudu = () => {
        //reload window
        window.location.reload();
    }

    return (
        <div className='Sudoko__container'>
            <div className="difficlty">
                <button
                    className={`btn ${difficultyLevel === Easy && 'active'}`}
                    onClick={() => Difficulty('easy')}>Easy</button>
                <button
                    className={`btn ${difficultyLevel === Medium && 'active'}`}
                    onClick={() => Difficulty('medium')}>Medium</button>
                <button
                    className={`btn ${difficultyLevel === Hard && 'active'}`}
                    onClick={() => Difficulty('hard')}>Hard</button>
                <button
                    className={`btn ${difficultyLevel === Expert && 'active'}`}
                    onClick={() => Difficulty('expert')}>Expert</button>
                <button
                    className={`btn ${difficultyLevel === Master && 'active'}`}
                    onClick={() => Difficulty('master')}>Master</button>
            </div>
            <table>
                <tbody>
                    {initialGrid.length !== 0 &&
                        [...Array(9)].map((row, rindex) => (
                            <tr key={rindex} className={(rindex + 1) % 3 === 0 ? "rBorder" : ""}>
                                {
                                    [...Array(9)].map((col, cindex) => (
                                        <td key={rindex + cindex} className={(cindex + 1) % 3 === 0 ? "cBorder" : ""}>
                                            <input type="text"
                                                onChange={(e) => onInputChange(e, rindex, cindex)}
                                                className="cellinput"
                                                value={sudokuArr[rindex][cindex] === 0 ? '' : sudokuArr[rindex][cindex]}
                                                disabled={initialGrid[rindex][cindex] !== 0}
                                            />
                                        </td>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            <div className="button-container">
                <button className='btn' onClick={undo} disabled={resetOff}>Undo</button>
                <button className="btn " onClick={checkHandleButton}>Check</button>
                <button className="btn " onClick={resetHandleButton} disabled={resetOff}>Reset</button>
                <button className="btn " onClick={solveHandleButton}>Solve</button>
                <button className="btn " onClick={nextHandleButton}>Next</button>
            </div>
            <div className='Personal__sudoku'>
                <div className="personal-container" >
                    {
                        mysuduCL ?
                            (<button className='btn' onClick={MySudokuPuzzle}> Do you Have Sodoku Puzzle..! click me..!</button>)
                            :
                            (mysuduFinish ?
                                (<button className='btn' onClick={MySudokuSubmit}>Submit Your Sudoku Puzzle</button>)
                                :
                                (<button className='btn' onClick={TryAgainMySudu}>Try Again...!</button>)
                            )
                    }
                </div>
            </div>
        </div>
    )
}

export default Sudoko
