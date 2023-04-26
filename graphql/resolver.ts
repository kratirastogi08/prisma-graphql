import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import jwt from 'jsonwebtoken'
import { GraphQLError } from 'graphql';
export const resolvers={
    Query:{
        users:async()=>{
          return await prisma.user.findMany()
        },
        posts:async()=>{
          return await prisma.post.findMany()
        }
    },
    Mutation:{
        createUser:async(_,{data})=>{
          const {name,email,bio}=data
         let user= await prisma.user.create({
            data:{
                name,
                email
            }
          })
          if(user && bio)
          {
            await prisma.profile.create({
                data:{
                    bio,
                    userId:user.id
                }
            })
          }
        const token= jwt.sign({userId:user.id},process.env.JWT_SECRET)
        console.log(token)
          return user;
        },
        createPost:async(_,{data},{userId})=>{
        if(!userId){
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                  code: 'UNAUTHENTICATED',
                  http: { status: 401 },
                },
              });
        }
        const post= await prisma.post.create({
            data:{
               ...data,
               published: false,
               authorId: userId
            }
          })
          return post
        },
        publishPost:async(_,{id},{userId})=>{
            if(!userId){
                throw new GraphQLError('User is not authenticated', {
                    extensions: {
                      code: 'UNAUTHENTICATED',
                      http: { status: 401 },
                    },
                  });
            }
         const updatedPost=  await prisma.post.update({
            where:{
                id
            },
            data:{
                published:true
            }
           })
           return updatedPost
        }
    },
    User:{
        posts:async(parent)=>{
        const posts=  await prisma.post.findMany({
            where:{
                authorId: parent.id
            }
          })
          return posts
        }
    },
    Post:{
       author:async(parent) =>{
        const author= await prisma.user.findUnique({
            where:{
                id: parent.authorId
            }
           })
           return author
       }
    }
}