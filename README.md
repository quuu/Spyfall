# Spyfall


## What is it?

[Spyfall](https://en.wikipedia.org/wiki/Spyfall_(card_game)) is a party game where every player besides 1, the Spy, is given the same location. 

The game proceeds with players asking each other questions in whatever order they like, trying to figure out who knows the location and who is the Spy. 

The Spy is trying to blend in with the rest of the players while trying to determine what location all the other players are in. 

The game ends once the players unanimously vote on who they think is the Spy, when the Spy wants to reveal him/her self and guess the location, or when the timer expires (TODO).

This implementation is written with React on the frontend, and Socket.io on the backend. It is a single page application that relies on rendering different components over the root component depending on which part of the application the user is on.

## Usage

Use the code in this repository to host the game on a computer and have others connect to it.

<b>Future:</b> Hosted version that can be played by visiting a URL.


### Server

```
npm install
node index.js
```
inside of the backend folder to start up the server


### Client

```
npm install
npm start
```
inside of the frontend folder to start up the client

<b>In `game.js`, must change the `socket` connection IP to the IP of the local machine that is running the server</b>


Users will go to ```http://\<host_ip_address\>:3000``` to play the game

## Customization

The list of locations is in the `backend` folder labled `locations.txt`.

Simply add or remove any locations and the game will process it the same
