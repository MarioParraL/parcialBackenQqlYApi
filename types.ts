import { ObjectId, OptionalId } from "mongodb";

export type LibroModel = OptionalId<{
  titulo: string;
  autores: ObjectId[];
  copias: number;
  city: string;
}>;

export type AutorModel = OptionalId<{
  nombre: string;
  biografia: string;
}>;

export type Libro = {
  id: string;
  titulo: string;
  autores: Autor[];
  copias: number;
  population: number;
};

export type Autor = {
  id: string;
  nombre: string;
  biografia: string;
};

export type APICity = {
  population: number;
};
