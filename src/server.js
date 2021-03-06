var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  enum SortDirection {
    ASC
    DESC
  }

  input SortBy {
    field: String!
    direction: SortDirection!
  }

  input SaveRecipeInput {
    id: Int!
    name: String!
    ingredients: String!
  }

  type Recipe {
    id: Int!
    name: String!
    ingredients: [String!]!
  }

  type Query {
    hello: String
    rollDice(numDice: Int!, numSides: Int): [Int]!
    recipe(id: Int!) : Recipe
    ingredients(recipeId: Int!, nameContains: String = null, sortBy: SortBy = {field: "id", direction: ASC}) : [String!]!
  }

  type Mutation {
    saveRecipe(recipe: SaveRecipeInput): Int
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello world!';
  },
  rollDice: ({ numDice, numSides }) => {
    var output = [];
    for (var i = 0; i < numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (numSides || 6)));
    }
    return output;
  },
  recipe: ({ id }) => {
    parent = this;
    return {
      id: id,
      name: "Food",
      directions: "do stuff",
      ingredients: () => root.ingredients({ recipeId: id })
    };
  },
  ingredients: ({ recipeId, nameContains, sortBy }) => {
    console.log(sortBy);
    console.log(nameContains);
    return ['one', 'two', recipeId.toString()];
  },
  saveRecipe: ({ recipe }) => {
    console.log(recipe);
    return recipe.id || 88;
  }
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
