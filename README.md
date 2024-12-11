# MSA Software Engineer Backend Challenge

## Description
Create a backend service for finding nearby pizza and juice shops using a third-party API (e.g., Yelp).

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/peer-owais-ahmad/MSE.git
    ```

2. Navigate to your project folder:
    ```bash
    cd MSE
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

4. Set up environment variables in the `.env` file.

## How to Run the Project

1. Start the server:
    ```bash
    nodemon app.js
    ```
    Your server will run on `http://localhost:3000`.

## Available Routes

### 1. **Search Pizza (GET Route)**

- **Endpoint**: `/search/pizza`
- **Query Parameters**: `location=<location>`
- **Example Request**:
    ```http
    GET http://localhost:3000/search/pizza?location=San+Francisco
    ```
    This will return a list of pizza shops in **San Francisco**.

### 2. **Search Juice (GET Route)**

- **Endpoint**: `/search/juice`
- **Query Parameters**: `location=<location>`
- **Example Request**:
    ```http
    GET http://localhost:3000/search/juice?location=San+Francisco
    ```
    This will return a list of juice shops in **San Francisco**.

### 3. **Search Combo (GET Route)**

- **Endpoint**: `/search/combo`
- **Query Parameters**: `location=<location>`
- **Example Request**:
    ```http
    GET http://localhost:3000/search/combo?location=Las+Vegas
    ```
    This will return a list of combo shops in **Las Vegas**.

### 4. **GraphQL Search (POST Route)**

- **Endpoint**: `/graphql`
- **Request Body (JSON)**:
    ```json
    {
      "query": "{ searchPizza(location: \"Los Angeles\") { name address rating phone } }"
    }
    ```
- **Example Request**:
    ```http
    POST http://localhost:3000/graphql
    Content-Type: application/json
    
    {
      "query": "{ searchPizza(location: \"Los Angeles\") { name address rating phone } }"
    }
    ```
    This will return a list of pizza shops in **Los Angeles**, including the name, address, rating, and phone number.

## Testing

1. To run tests, use the following command:
    ```bash
    npm test
    ```

## License
Peer Owais Ahmad (looking to work with you)
