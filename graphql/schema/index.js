//Requires from node_modules
const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Post {
        _id: ID!
        title: String!
        description: String!
        category: String
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
        likes: [CommentLike!]
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
        userProfileImg: String
        createdPosts: [Post!]
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
        category: String!
        imageUrl: String
    }

    input updatePostInput {
        title: String
        description: String
        imageUrl: String
        category: String
    }

    input UserInput {
        username: String!
        email: String!
        password: String!
    }

    type RootQuery {
        posts: [Post!]!
        users: [User!]!
        userData(_id: String): User!
        postData(_id: String): Post!
        login(email: String!, password: String!):AuthData!
    }

    type RootMutation {
        createPost(postInput: PostInput): Post
        updatePost(_id: String!, title: String, description: String, imageUrl: String, category: String ): Post
        deletePost(_id: String!): Post
        createUser(userInput: UserInput): User
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)