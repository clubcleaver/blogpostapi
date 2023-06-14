# BLOG POST API

## End Points

API End Points are broken down in three different sections according to functionality logic, So they remain relatable.

1. user
2. posts
3. comment

##### REST Full, excerpt:

```URL
** USER **
POST /user/register - // Register User
POST /user/login - //Login User

** POSTS **
GET /posts -  // Get All
GET /posts/:PostId - //Get One
POST /posts - // Submit Post
PATCH /posts - // Edit only Post
DELETE /posts - // Delete Post including Comments

** COMMENTS **
POST /comment - // Submit Comment on Post
DELETE /Comment - // Delete Comment on Post
```

---

## Details

Paths to API EndPoints are listed below according to represented functionality.

### USER

_REGISTER_
Path: `/user/register`
Mehod: `POST`
Content Type: `JSON`
JSON Fields Required in request body:

```json
{
  "username": "<Username>",
  "email": "<email@address.com>", //sanitised
  "password": "<password>" //minimum 6 characters
}
```

Returns:

```JSON
{
"success": true/false,
"message": "<message>"
}
```

_LOGIN_
Path: `/user/login`
Mehod: `POST`
Content Type: `JSON`
Required in request body:

```JSON
{
"email": "<email@address>",
"password": "<password>"
}
```

Returns: Auth-Token in Token

```JSON
{
"success": true/false,
"message": "<message>",
"Token": "String" // If Success: true
}
```

### POSTS

_GET ALL_
Path: `/posts`
Mehod: `GET`
Requirements: `NONE`
Returns:

```JSON
[
  {
    "_id": "String(ObjectId)", //Post ID
    "author": {
      "_id": "String(ObjectId)", //User ID
      "username": "<username>",
      "__v": 0
    },
    "date": "Doth DATE YEAR", //date submitted
    "category": ["String", "String"],
    "post": "String(POST)",
    "comments": [
      {
      "_id": "String(ObjectId)", //Comment ID
      "author": "<username>".
      "comment": "Doth DATE YEAR" //date submitted
      }
    ],
    "__v": 10 //times updated
  },
  ...
]
```

_GET ONE_
Path: `/posts/:postid`
Mehod: `GET`
Requirements: `NONE`
Returns:

```JSON
[
  {
    "_id": "String(ObjectId)", //Post ID
    "author": {
      "_id": "String(ObjectId)", //User ID
      "username": "<username>",
      "__v": 0
    },
    "date": "Doth DATE YEAR", //date submitted
    "category": ["String", "String"],
    "post": "String(POST)",
    "comments": [
      {
      "_id": "String(ObjectId)", //Comment ID
      "author": "<username>",
      "comment": "Doth DATE YEAR" //date submitted
      }
    ],
    "__v": 10 //times updated
  },
]

```

_SUBMIT - Authenticated_
Path: `/posts`
Mehod: `POST`
Content Type: `JSON`
Required in request body:

```JSON
{
  "category": "TEST",
  "post": {"New Post"},
}
```

Required in Auth. Header: `Auth Token //Required`

Returns:

```JSON
{
"success": true / false,
"message": "<message>",
}
```

\*EDIT - Authenticated - POST Owner
Path: `/posts`
Mehod: `PATCH`
Content Type: `JSON`
Required in request body:

```JSON
{
  "postId": "String(ObjectId)",
  "post": "<Edited Post>",
}
```

Required in Auth. Header: `Auth Token //Required`

Returns:

```JSON
{
"success": false, // Only if Fails
"message": "<message>",
"post": {'Updated Post'} // If Success: true
}
```

_DELETE - Authenticated - POST Owner_
Path: `/posts`
Mehod: `DELETE`
Content Type: `JSON`
Required in request body:

```JSON
{
  "postId": "String(ObjectId)",
}
```

Required in Auth. Header: `Auth Token //Required`

Returns:

```JSON
{
"success": true / false,
"message": "<message>",
}
```

### COMMENTS

_SUMBIT - Authenticated_
Path: `/comment`
Mehod: `POST`
Content Type: `JSON`
Required in request body:

```JSON
{
  "postId": "String(ObjectId)",
  "comment": "<New Comment>"
}
```

Required in Auth. Header: `Auth Token //Required`

Returns:

```JSON
{
"success": true / false,
"message": "<message>",
"post": {"<Updated Post>"}
}
```

_DELETE - Authenticated - POST Owner_
Path: `/comment`
Mehod: `DELETE`
Content Type: `JSON`
Required in request body:

```JSON
{
  "postId": "String(ObjectId)",
  "commentId": "String(ObjectId)",
}
```

Required in Auth. Header: `Auth Token //Required`

Returns:

```JSON
{
"success": true / false,
"message": "<message>",
}
```
