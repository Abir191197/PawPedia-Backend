# Pet Care Tips & Stories

# Overview
"Pet Care Tips & Stories" offers a valuable mix of practical advice and engaging tales for pet owners. It covers essential care aspects such as proper nutrition, exercise, grooming, and regular veterinary hospital visits to ensure pets stay healthy and happy. Additionally, it includes heartwarming stories of love and loyalty between pets and their owners, as well as inspiring adoption and rescue tales. Together, these tips and stories provide both guidance on maintaining pet well-being and emotional moments that highlight the deep bond between humans and their pets.

## Technology Stack

### Server

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Zod](https://img.shields.io/badge/zod-%233068b7.svg?style=for-the-badge&logo=zod&logoColor=white)
![mongoose](https://img.shields.io/badge/Mongoose-563D7C?style=for-the-badge&logo=mongoose&logoColor=white)
![Passport Js](https://img.shields.io/badge/PassportJS-114D7C?style=for-the-badge&logo=PassportJS&logoColor=white)

## API Reference

### User Routes

#### Sign Up

- **Method:** `POST`
- **Endpoint:** `/api/auth/signup`

Creates a new user account.

| Parameter  | Type     | Description                                  |
| :--------- | :------- | :------------------------------------------- |
| `name`     | `string` | **Required**. Name of the user.              |
| `email`    | `string` | **Required**. Email address.                 |
| `password` | `string` | **Required**. Password for the user.         |
| `phone`    | `string` | **Required**. Phone number.                  |
| `address`  | `string` | **Required**. Physical address.              |
| `role`     | `string` | **Required**. Role of the user (admin/user). |

#### Login

- **Method:** `POST`
- **Endpoint:** `/api/auth/login`

Authenticates a user and returns a JWT token.

| Parameter  | Type     | Description                  |
| :--------- | :------- | :--------------------------- |
| `email`    | `string` | **Required**. Email address. |
| `password` | `string` | **Required**. Password.      |

#### Get Profile

- **Method:** `GET`
- **Endpoint:** `/api/users/me`

Retrieves the logged-in user's profile.

#### Update Profile

- **Method:** `PUT`
- **Endpoint:** `/api/users/me`

Updates the logged-in user's profile.

| Parameter | Type     | Description                                 |
| :-------- | :------- | :------------------------------------------ |
| `name`    | `string` | Optional. Updated name of the user.         |
| `phone`   | `string` | Optional. Updated phone number of the user. |

---

### Pet Post Routes

#### Create Post

- **Method:** `POST`
- **Endpoint:** `/api/pet/posts`

Creates a new Post entry.
| Parameter | Type | Description |
| :------------- | :------- | :------------------------------------------- |
| `title` | `string` | **Required**. Title of the post. |
| `content` | `string` | **Required**. Main content or description of the post. |
| `category` | `string` | **Required**. Category of the post (e.g., care tips, pet stories). |
| `isPremium` | `boolean`| **Optional**. Indicates if the post is premium content. |
| `premiumAmount`| `number` | **Optional**. Amount required for accessing premium content. |
| `images` | `string[]` | URLs of images related to the post. |
| `upvote` | `number` | Number of upvotes the post has received. |
| `downvote` | `number` | Number of downvotes the post has received. |

#### Get All Posts

- **Method:** `GET`
- **Endpoint:** `/api/pet/posts`

Retrieves a list of all available posts.

#### Get Single Posts

- **Method:** `GET`
- **Endpoint:** `/api/pet/posts/:id`

Retrieves a single post by its ID.

| Parameter | Type     | Description                               |
| :-------- | :------- | :---------------------------------------- |
| `id`      | `string` | **Required**. ID of the post to retrieve. |

#### Update Post

- **Method:** `PUT`
- **Endpoint:** `/api/pet/posts/:id`

#### Delete Post

- **Method:** `DELETE`
- **Endpoint:** `/api/pet/posts/:id`

Deletes a post entry.

| Parameter | Type     | Description                             |
| :-------- | :------- | :-------------------------------------- |
| `id`      | `string` | **Required**. ID of the post to delete. |

---

#### Create Comments

- **Method:** `POST`
- **Endpoint:** `/posts/:postId/comments`

| Parameter   | Type             | Description                                |
| :---------- | :--------------- | :----------------------------------------- |
| `_id`       | `any`            | Unique MongoDB identifier for the comment. |
| `id`        | `string`         | Unique identifier for the comment.         |
| `postId`    | `Types.ObjectId` | ID of the post the comment belongs to.     |
| `authorId`  | `Types.ObjectId` | ID of the author of the comment.           |
| `content`   | `string`         | Content of the comment.                    |
| `createdAt` | `Date`           | Date when the comment was created.         |
| `updatedAt` | `Date`           | Date when the comment was last updated.    |

#### Get Comments By Post Id

- **Method:** `GET`
- **Endpoint:** `/posts/:postId/comments`

#### Comment update

- **Method:** `PUT`
- **Endpoint:** `/comments/:id`

#### Comment delete

- **Method:** `DELETE`
- **Endpoint:** `/comments/:id`

## Backend Resource

- [PawPedia]()

## Installation

Install my-project with npm

```bash
 git clone https://github.com/Abir191197/PawPedia.git

   cd PawPedia
npm install

PORT=3000

MONGODB_URI=

JWT_SECRET=your_jwt_secret

npm run start:dev
```

## License

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)
