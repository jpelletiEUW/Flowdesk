#Cumulative Delta Calculator

A project made to answer Flowdesk's subject

You will need node.js and npm to run the project

## Install

    $ git clone git@github.com:jpelletiEUW/Flowdesk.git
    $ cd Flowdesk
    $ npm install

## Running the project

    $ npm start

## Simple build for production

    $ npm build

## How does it work?

    After starting the project, you will have to go to http://localhost:3001/cumulative-delta/<PAIR>.
    <PAIR> will have to be in format COIN1-COIN2 (example: BTC-USDT).
    If the pair is valid, you will get the cumulative delta for the last trades on the pair on Kucoin, else you will get an error message.
    Please note that pairs are only valid in one order (BTC-USDT is valid, USDT-BTC isn't), so you may need to swap both coins to get a result.
    If you still don't get a result, then Kucoin doesn't have the pair that you need listed!
    Delta is returned in form of a string.
