# Frontier Challenge

## Project Description
Voting app that includes authentication with Metamask and connected to a smart contract with react

## Tech Stack

* Front End: HTML, CSS, JavaScript, React,web3
* Back End: Node.js, Express.js, Sockets
* Database: Mongoose and MongoDB

## Server - REST API

* User Router:
  *  POST - /api/auth
        Creates and returns a new user through metamask

  *  GET - /api/users/:id + /api/users
        Finds and returns a user by id pr returns the whole user DB

  *  POST - /api/resetVotes
        Resets the voting for all candidates

  *  PATCH - /api/users/:userId 
        Changes the user's username

*  Candidate Router:
  *  GET - /candidate/results
        Returns all candidate information

  *  POST - /candidate/create
        Creates and returns a new candidate

## Client - Components

* App -
    Purpose: Start of application -
    Connected: Yes -
    State: Stateful -
    Children:
      User
      Voting
      Table
      Info
      Login
      Purchase
* User -
    Purpose: Deals with the user's profile -
    Connected: Yes -
    State: Stateful -
    Children:
      none
* Voting -
    Purpose: Deals with Token and smart contract data and presents the user with stats -
    Connected: No -
    State: Stateless -
    Children: 
      none
* Table -
    Purpose: Provides the Graphical representation of the current votes per candidate -
    Connected: Yes -
    State: Stateful -
    Children:
      none
* Info -
    Purpose: Provides the user with instructions on how to use the app -
    Connected: Yes -
    State: Stateless -
    Children:
      none
* Login -
    Purpose:  Deals with Metamask and auth -
    Connected:  Yes -
    State:  Stateful -
    Children:
      none
* Purchase -
    Purpose:  Provides the user a way to buy more votes -
    Connected: No -
    State: Stateless -
    Children:
      none



## Defects

 * Smart contract and ICO has not been completed and would be implemented with more time
 
 

