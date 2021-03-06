//Requires from node_modules
const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Post {
        _id: ID!
        title: String!
        description: String!
        category: Category!
        race: Race!
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
        imageUrl: String
        createdPosts: [Post!]
        createdComments: [Comment!]
        likedPost: [PostLike!]
        likedComments: [PostLike!]
    }

    type Category {
        _id: ID!
        name: String!
        description: String!
        icon: String!
        posts: [Post!]
    }

    type Race {
        _id: ID!
        name: String!
        description: String!
        icon: String!
        posts: [Post!]
    }

    type AuthData {
        userId: ID!
        userRol: String!
        token: String!
        tokenExpiration: Int!
    }

    input PostInput {
        title: String
        description: String
        category: String
        race: String
        imageUrl: String
    }

    input CategoryInput {
        name: String!
        description: String!
        icon: String!
    }

    input RaceInput {
        name: String!
        description: String!
        icon: String!
    }

    input CommentInput {
        postId: String!
        content: String!
    }

    input CommentEditInput {
        commentId: String!
        content: String!
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
        categories: [Category!]!
        categoryData(name: String!): Category!
        races: [Race!]!
        raceData(name: String!): Race!
        postComments(postId: String): [Comment!]!
        userComments(userId: String): [Comment!]!
    }

    type RootMutation {
        createPost(postInput: PostInput): Post
        updatePost(_id: String!, title: String, description: String, imageUrl: String, category: String, race: String ): Post
        deletePost(_id: String!): Post
        createUser(userInput: UserInput): User
        createCategory(categoryInput: CategoryInput): Category
        createRace(raceInput: RaceInput): Race
        createComment(commentInput: CommentInput): Comment
        updateComment(commentEditInput: CommentEditInput ): Comment
        deleteComment(_id: String!): Comment
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)