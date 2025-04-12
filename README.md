# The Joy Of Painting API

This project provides an API to filter and retrieve episode information on "The Joy of Painting" by Bob Ross.

## Features

- Filter by month

  - Allows users to filter episodes based on the month they were originally broadcasted

- Filter by subject matter

  - Allows users to filter episodes based on the subject matters in the paintings

- Filter by color palette

  - Allows users to filter episodes based on the colors used in the paintings

- Support for case insensitive queries
  - Users can query without worrying about case sensitivity in subject matter or color fields

## Installation

1.  Clone the repository
2.  Install dependencies
    `npm install`
3.  Set up the PostgreSQL database by running the sql script `psql -U your_user -d postgres -f create_db.sql`

4.  Start the server with
    `node server.js`

        The api will be running on http://localhost:3000

        You can test the api using Postman by sending GET requests to `http://localhost:3000/api/episodes`
