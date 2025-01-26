export const schema = `#graphql

type Query{
    getLibros: [Libro!]!
    getLibro(id:ID!): Libro!

    getAutores: [Autor!]!
    getAutor(id:ID!): Autor!

}

type Mutation{
    addLibro(titulo: String!, autores: [ID!]!, copias: Int!, city: String!): Libro!
    addAutor(nombre: String!, biografia: String!): Autor!

    deleteLibro(id: ID!): Boolean!
    deleteAutor(id: ID!): Boolean!
}

type Libro{
    id: ID!
    titulo: String!
    autores: [Autor!]!
    copias: Int!
    population: Int! 
}

type Autor{ 
    id: ID!
    nombre: String!
    biografia: String!
}



`;
