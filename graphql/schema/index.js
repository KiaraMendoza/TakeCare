//Requires from node_modules
const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Post {
        _id: ID!
        title: String!
        description: String!
        imageUrl: String
        createdAt: String!
        updatedAt: String!
        creator: User!
        comments: [Comment!]
        likes: [PostLike!]
    }

    type PostLike {
        _id: ID!
        post: Post!
        creator: User!
    }

    type Comment {
        _id: ID!
        content: String!
        post: Post!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }
    
    type CommentLike {
        _id: ID!
        comment: Comment!
        creator: User!
    }

    type User {
        _id: ID!
        username: String!
        email: String!
        password: String
        rol: String!
        createdPost: [Post!]
        createdComments: [Comment!]
        likedPost: [PostLike!]
        likedComments: [PostLike!]
    }

    type AuthData {
        userId: ID!
        userRol: String!
        token: String!
        tokenExpiration: Int!
    }

    input PostInput {
        title: String!
        description: String!
        imageUrl: String
    }

    input UserInput {
        username: String!
        email: String!
        password: String!
    }

    type RootQuery {
        posts: [Post!]!
        users: [User!]!
        login(email: String!, password: String!):AuthData!
    }

    type RootMutation {
        createPost(postInput: PostInput): Post
        createUser(userInput: UserInput): User
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)