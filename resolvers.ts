import { Collection } from "mongodb";
import { APICity, AutorModel, LibroModel } from "./types.ts";
import { ObjectId } from "mongodb";
import { GraphQLError } from "graphql";

type Context = {
  LibrosCollection: Collection<LibroModel>;
  AutoresCollection: Collection<AutorModel>;
};

type QueryGetLibroArgs = {
  id: string;
};

type QueryGetAutorArgs = {
  id: string;
};

type MutationAddLibroArgs = {
  titulo: string;
  autores: string[];
  copias: number;
  city: string;
};

type MutationAddAutorArgs = {
  nombre: string;
  biografia: string;
};

type MutationDeleteLibroArgs = {
  id: string;
};

type MutationDeleteAutorArgs = {
  id: string;
};

export const resolvers = {
  Query: {
    getLibros: async (
      _: unknown,
      __: unknown,
      ctx: Context,
    ): Promise<LibroModel[]> => {
      return await ctx.LibrosCollection.find().toArray();
    },

    getLibro: async (
      _: unknown,
      args: QueryGetLibroArgs,
      ctx: Context,
    ): Promise<LibroModel | null> => {
      const libro = await ctx.LibrosCollection.findOne({
        _id: new ObjectId(args.id),
      });
      return libro;
    },

    getAutores: async (
      _: unknown,
      __: unknown,
      ctx: Context,
    ): Promise<AutorModel[]> => {
      return await ctx.AutoresCollection.find().toArray();
    },

    getAutor: async (
      _: unknown,
      args: QueryGetAutorArgs,
      ctx: Context,
    ): Promise<AutorModel | null> => {
      return await ctx.AutoresCollection.findOne({
        _id: new ObjectId(args.id),
      });
    },
  },

  Mutation: {
    addLibro: async (
      _: unknown,
      args: MutationAddLibroArgs,
      ctx: Context,
    ): Promise<LibroModel> => {
      const { titulo, autores, copias, city } = args;

      const existeLibro = await ctx.LibrosCollection.findOne({ titulo });
      if (existeLibro) throw new GraphQLError("Libro ya existente");

      const { insertedId } = await ctx.LibrosCollection.insertOne({
        titulo,
        autores: autores.map((a) => new ObjectId(a)),
        copias,
        city,
      });

      return {
        _id: insertedId,
        titulo,
        autores: autores.map((a) => new ObjectId(a)),
        copias,
        city,
      };
    },

    addAutor: async (
      _: unknown,
      args: MutationAddAutorArgs,
      ctx: Context,
    ): Promise<AutorModel> => {
      const { nombre, biografia } = args;

      const existeAutor = await ctx.AutoresCollection.findOne({ nombre });
      if (existeAutor) throw new GraphQLError("Autor ya existente");

      const { insertedId } = await ctx.AutoresCollection.insertOne({
        nombre,
        biografia,
      });

      return {
        _id: insertedId,
        nombre,
        biografia,
      };
    },

    deleteLibro: async (
      _: unknown,
      args: MutationDeleteLibroArgs,
      ctx: Context,
    ): Promise<boolean> => {
      const { deletedCount } = await ctx.LibrosCollection.deleteOne({
        _id: new ObjectId(args.id),
      });

      return deletedCount === 1;
    },

    deleteAutor: async (
      _: unknown,
      args: MutationDeleteAutorArgs,
      ctx: Context,
    ): Promise<boolean> => {
      const { deletedCount } = await ctx.AutoresCollection.deleteOne({
        _id: new ObjectId(args.id),
      });

      return deletedCount === 1;
    },
  },

  Libro: {
    id: (parent: LibroModel) => {
      return parent._id!.toString();
    },

    autores: async (parent: LibroModel, _: unknown, ctx: Context) => {
      const ids = parent.autores;
      return await ctx.AutoresCollection.find({ _id: { $in: ids } }).toArray();
    },

    population: async (parent: LibroModel): Promise<number> => {
      const API_KEY = Deno.env.get("API_KEY");
      if (!API_KEY) throw new GraphQLError("You need the Api Ninja API_KEY");

      const city = parent.city;
      const url = `https://api.api-ninjas.com/v1/city?name=${city}`;

      const data = await fetch(url, {
        headers: {
          "X-API-KEY": API_KEY,
        },
      });

      if (data.status !== 200) throw new GraphQLError("API NINJA ERROR");

      const response: APICity[] = await data.json();
      return response[0].population;
    },
  },

  Autor: {
    id: (parent: AutorModel) => {
      return parent._id!.toString();
    },
  },
};
