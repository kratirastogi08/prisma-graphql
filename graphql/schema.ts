import {gql} from 'apollo-server'
export const typeDefs=gql`
   type User{
      id: Int!
      name: String
      email: String
      posts: [Post]
   }

   type Post{
    id: Int!
    title: String
    content: String
    published: Boolean
    author: User
    createdAt: String
    updatedAt: String
   }

   type Profile{
    id: Int!
    bio: String
    user: User
   }

   type Query{
     users: [User]
     posts: [Post]
     userProfile(id:Int!): Profile
   }

   type Mutation{
    createUser(data:UserInput!): User
    createPost(data: PostInput!):Post
    publishPost(id:Int!): Post
   }
   input UserInput{
    name:String!
    email: String!
    bio: String
   }
   input PostInput{
    title: String
    content: String
   }
`
