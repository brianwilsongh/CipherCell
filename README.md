# Background

CipherCell is a hacker-themed HTML5 game loosely based on Bypass, a mini-game from the Mass Effect franchise. Like the original, CipherCell will feature multiple levels of rotating, concentric rings where the goal is for the player to move to the center of the cell without being detected.

![Image of CipherCell](http://i.imgur.com/aKcTEb6.png)

# Rules

Players must reach the innermost ring of the cell. Once this happens, they will spawn again at the 6 o'clock position, and the difficulty of the stage will be incremented. The goal is to reach the center of the cell as many times as possible in the shortest possible time, leading to the highest possible point tally in the end.

Players lose when detection reaches 100%. Any of the following conditions can increase the detection percentage:

- player comes into contact with a red "killer" line, gaining detection points the longer they are inside of it
- player comes into contact with a golden "hunter killer", gaining detection at three times the normal rate
- player runs out of time on the counter, resulting in a continuous gain in detection

# Controls

- Move the arrow with either WASD or arrow keys
- Players can only move within the five 'orbits' of the ring, using A/D or left/right arrows to rotate around
- Players start outside of the cell with the ability to rotate and chooser where to enter it
- Players can move closer to the center with the "up" command (W or up arrow)
- Players can move away from the center with the "down" command (S or down arrow)
- The game can be paused with the spacebar

# Implementation

The game is implemented with HTML5 canvas and vanilla JavaScript, which is bundled together with Webpack.

The game utilizes quite a bit of trigonometry to calculate everything from the rotation of the player's arrow to the calculations involved in collision detection.
