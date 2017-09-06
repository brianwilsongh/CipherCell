# Background

CipherCell is a game based on Bypass, a minigame from the Mass Effect franchise. Like the original, CipherCell will feature multiple 'levels' of rotating, concentric rings where the goal is for the player to move an arrow to the center.

![Image of Bypass from the original](https://vignette.wikia.nocookie.net/masseffect/images/3/3f/Decrypting.png)

# MVP

Players will be able to:
- move the arrow with WASD commands on the keyboard, being able to jump into another ring towards the center with W and away from the center with S
- pause the game
- have multiple chances to "beat" the game by having multiple "lives" which are lost when a player collides with one of the

# Wireframe

(soon...)

# Implementation

I believe that I will just be using native javascript for this game, and the vast majority of the work will be on canvas. I will have to animate the objects that rotate in a circle (hence figuring out circular animation) and I will have to have a way of detecting object collision. The player's movement will also be challenging, as they will have to be able to jump from one ring to the next.

Techs:

HTML5 canvas
Javascript

Will need 2 canvases stack atop one another, one for bg and one to hold rotating circles & the player

# Implementation Timeline

D1 - Setup canvas, determine appropriate size, determine method for circular animation
D2 - Determine movement of player, determine how to detect object collision
D3 - Build out details of the game, including multiple stages and fix errors that may arise, include the timer
