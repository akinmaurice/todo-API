# todo-API

NodeJS, ExpressJS and MongoDB RESTful API with JWT authentication.

## API Features

1. User authentication with JWT.
2. User can perform CRUD operations on Todo List
3. API uses Accept header to accept authentication JWT token

## Getting Started

  1. `git clone https://github.com/akinmaurice/todo-API.git`
  2. `cd todo-API`
  3. `npm install`
  4.  set up env variables
  5. `npm start`

The above will get you a copy of the project up and running on your local machine for development and testing purposes.

## Dependencies

  1. [MongoDB]
  2. [NodeJS]
  3. [ExpressJS]

## API Endpoints

Most endpoints require a token for authentication. The API call should have the token in Authorization header.

    authorization: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE0Njc2MTkxNDV9.R6VLZD4qtsdVHXZwU8bEo6S16cbNQfo7lICsNdAq00I"

| EndPoint                                |   Functionality                      |
| --------------------------------------- | ------------------------------------:|
| POST /user/register                     | Signup a user                        |
| POST /user/login                        | Login user                           |
| POST /todo/createTodo                   | Create a new todo                    |
| GET /todos/                             | List all todos                       |
| GET /todo/:slug                         | Get single todo                      |
| PUT /todo/:id                           | Update this todo                     |
| DELETE /todo/:id                        | Delete this single todo              |
| POST /todo/add/:id                      | Create Todo Activity                 |
| DELETE /todo/delete/:id                 | Delete Activity from Todo            |


## Responses

The API responds with JSON data by default.

## Error Handling

The API responds with an error message and http status code whenenever it encounters an error.

    {
      "status": "404",
      "message": "Something Went Wrong"
    }

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://opensource.org/licenses/MIT) file for details
