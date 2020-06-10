//Requires from node_modules
const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Booking {
        _id: ID!
        event: Event!
        user: User!
        createdAt: String!
        updatedAt: String!
    }

    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
        creator: User!
    }

    type CommentLike {
        _id: ID!
        comment: Comment!
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

    type User {
        _id: ID!
        username: String!
        email: String!
        password: String
        rol: String!
        createdEvents: [Event!]
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

    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
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
        events: [Event!]!
        posts: [Post!]!
        bookings: [Booking!]!
        login(email: String!, password: String!):AuthData!
    }

    type RootMutation {
        createEvent(eventInput: EventInput): Event
        createPost(postInput: PostInput): Post
        createUser(userInput: UserInput): User
        bookEvent(eventId: ID!): Booking!
        cancelBooking(bookingId: ID!): Event!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)