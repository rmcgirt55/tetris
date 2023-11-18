# Tetris by Richard McGirt

## Description

Welcome to Tetris by Richard McGirt! This classic puzzle game brings the nostalgic challenge of arranging falling blocks to create solid lines. With intuitive controls and a captivating user interface, Tetris promises an enjoyable gaming experience.

![Tetris Demo GIF](demo.gif)
*GIF showcasing Tetris gameplay*

## Demo

Check out the live demo of the game hosted [here](link_to_demo), where you can experience the thrill of Tetris firsthand!

## Technologies

- HTML
- CSS
- JavaScript

## Technical Information

### Installation
To set up the project locally:
1. Clone this repository: `git clone https://github.com/RichardMcGirt/TetrisApp.git`
2. Open the `index.html` file in your preferred web browser.

### Contribution Guidelines
Thank you for considering contributing to Tetris! Please follow these steps:
- Fork the repository
- Create a new branch (`git checkout -b feature/awesome-new-feature`)
- Make your changes
- Commit your changes (`git commit -m 'Add feature'`)
- Push to the branch (`git push origin feature/awesome-new-feature`)
- Create a Pull Request

### Issues
Current known issues include occasional block misalignment during gameplay. Additionally, we plan to introduce level-based challenges, implement a player score-board, and optimize for mobile screens in future updates.

## Changelog

### [1.0.0] - 2023-11-18
- Initial release of Tetris by Richard McGirt

## API Documentation

Currently, Tetris does not have exposed APIs. Future updates may include APIs for high scores, game statistics, and user profiles.


**Please feel free to explore, contribute, and enjoy playing Tetris by Richard McGirt!**


# TETRIS

## How To Play:
### Controls:
- Arrow Keys for Left, Right, and Down
- 'Z' and 'X' to Rotate Counterclockwise and Clockwise respectively
- 'C' to Hold a Piece
- Up Arrow Key to Hard Drop
- Press R to Restart
- Press P to Pause

Using the arrow keys to move the pieces left, right and down, and 'z' and 'x' to roatate the pieces, fill the rows with set pieces to clear lines. Clear multiple lines in one move to earn more points per line. The more lines you clear, the faster the pieces fall. See how many points you can get before the pieces reach the top!

With each new piece that comes, you have the option to hold that piece for later in exchange for the current held piece or the next piece if there is no held piece.

A *Hard Drop* is a move that drops the piece to the location of it's shadow.

## SCORING MECHANICS:
**All points are multiplied by current level**
- One line cleared = 100 points
- Two lines cleared = 300 points
- Three lines cleared = 500 points
- Four lines cleared = 800 points
- 1 point for each tile moved down
- 2 points * distance moved with hard drop

For every 5 lines cleared, the level increases by 1.

At level 1, the gamespeed allows for one second between each frame. For every level-up from levels 1 to 10, the gamespeed is reduced by 100ms. From levels 10 to 15, the gamespeed is reduced by 10ms. At levels 15 and higher, the gamespeed remains at 50ms. (I'm not sure at what level the game becomes impossible to play, but level 12 is the furthest I've gotten.)

## How the game works:
### Main grid:
The main grid of the game is stored as a 10 x 20 2D array of integers. Initially, they are all 0, representing empty tiles. Non-empty tiles are represented by a value ranging between 1-7, representing which color that tile should be filled with. When a new piece is spawned, it is shown above the grid on the canvas, but is not set into the main grid array until it is set when it collides with either a piece or the floor.

### Shapes and collision:
The shapes are all represented by smaller 2D arrays ranging from 2x2 to 4x4. To check collisions when calculating the current piece's available moves, the shape array is iterated through, and is checked in the new possible position to see if the move is valid, and if it is, the move is completed, otherwise it is not.
