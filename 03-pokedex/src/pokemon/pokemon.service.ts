import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Injectable()
export class PokemonService {
  // Inyección de dependencias del modelo, haciendo referencia a nuestra entity Pokemon.
  // El modelo por si solo no es inyectable porque no es un Provider, de ahí que se use el decorador
  // @InjectModel con el nombre de ese modelo.
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  // Las inserciones en la BD siempre son asíncronas.
  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    // Validaciones.
    // Con el try catch evitamos 2 consultas a BD (ver que no exista el campo no y que no exista el campo name).
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    // Tenemos que hacer hasta 3 búsquedas en BD.

    // 1. Es el campo no
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    // 2. Es el MongoId. Tenemos que saber que es un MongoId porque si no dará error. Se usa isValidObjectId(term)
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    // 3. Es el campo nombre.
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLocaleLowerCase().trim(),
      });
    }

    if (!pokemon) {
      throw new NotFoundException(
        `Pokemon with id, name or no ${term} not found!`,
      );
    }

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    // Como no sé si me envían el nombre, el no o el MongoId tengo que buscar primero.
    // Aprovecho el método de búsqueda ya creado que me devuelve un objeto pokemon.
    const pokemon = await this.findOne(term);
    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();

    try {
      await pokemon.updateOne(updatePokemonDto);
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  // Es siempre un mongoId
  async remove(id: string) {
    // Con una sola consulta se busca y se borra.
    // Problema: ahora mismo si es un mongoId correcto, pero que no existe en nuestra BD devuelve un 200.
    // Queremos resolver el problema pero evitar una doble consulta (una de buscar y otra de eliminar)
    const result = this.pokemonModel.findByIdAndDelete(id);
    return result;
  }

  // Excepciones no controladas
  private handleExceptions(error: any) {
    // El código 11000 es clave duplicada.
    if (error.code === 11000)
      throw new BadRequestException(
        `Pokemon exists in db ${JSON.stringify(error.keyValue)}`,
      );

    // Otro tipo de problema
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create Pokemon - Check server logs`,
    );
  }
}
