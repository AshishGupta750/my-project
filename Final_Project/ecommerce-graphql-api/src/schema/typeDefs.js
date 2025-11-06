const { gql } = require('apollo-server-express');

module.exports = gql`
  scalar DateTime

  type Product {
    id: ID!
    name: String!
    description: String!
    price: Float!
    inStock: Boolean
    createdAt: DateTime
    category: Category
  }

  type Category {
    id: ID!
    name: String!
    products: [Product]
  }

  # --- Add these new types ---
  
  type User {
    id: ID!
    email: String!
    isAdmin: Boolean
    # Note: We NEVER return the password hash
  }

  # This is the object we return after login/register
  type AuthPayload {
    token: String!
    user: User!
  }

  # ----------------------------

  type Query {
    product(id: ID!): Product
    products(
      filter: ProductFilterInput
      sort: ProductSortInput
      limit: Int = 10
      offset: Int = 0
    ): ProductConnection
    
    # --- Add this query ---
    # Gets the currently logged-in user (via their token)
    me: User
  }

  type Mutation {
    createProduct(input: CreateProductInput!): Product
    
    # --- Add these mutations ---
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
  }

  # --- Inputs & Connections ---

  type ProductConnection {
    nodes: [Product]!
    totalCount: Int!
  }

  input CreateProductInput {
    name: String!
    description: String!
    price: Float!
    categoryId: ID!
    inStock: Boolean
  }

  input ProductFilterInput {
    categoryId: ID
    priceMin: Float
    priceMax: Float
    inStock: Boolean
    searchText: String
  }

  input ProductSortInput {
    field: ProductSortField
    order: SortOrder
  }

  enum ProductSortField {
    price
    createdAt
    name
  }

  enum SortOrder {
    ASC
    DESC
  }

  # --- Add these new inputs ---
  
  input RegisterInput {
    email: String!
    password: String!
    # You could add name, etc. here
  }

  input LoginInput {
    email: String!
    password: String!
  }
`;