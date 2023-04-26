
import { ApolloServer } from "apollo-server";
import jwt from "jsonwebtoken";
import {ApolloServerPluginLandingPageGraphQLPlayground} from 'apollo-server-core'
import {typeDefs} from "./graphql/schema"
import {resolvers} from "./graphql/resolver"
 
// define the Apollo Server instance
const server = new ApolloServer({ typeDefs, resolvers, context:({req})=>{
        const {authorization}=req.headers;
        if(authorization)
        {
            const {userId} =  jwt.verify(authorization,process.env.JWT_SECRET)
            return {userId}
        }
},
plugins:[ApolloServerPluginLandingPageGraphQLPlayground]
});
 
// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`GraphQL server running at ${url}`);
});