import { gql } from '@apollo/client';

export const typeDefs = gql`
  type Todo {
    _id: ID!
    task: String!
    isCompleted: Boolean!
  }

  type Query {
    todos: [Todo]!
  }

  type Mutation {
    addTodo(task: String!, isCompleted: Boolean!): Todo!
  }
`;
