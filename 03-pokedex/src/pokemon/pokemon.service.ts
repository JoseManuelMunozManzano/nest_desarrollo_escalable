import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

    // Falta agregar validaciones.
    // PROBLEMA: Si se intenta grabar dos veces el mismo no o el mismo name da error 500 sin indicar una
    // información de que salió mal.
    const pokemon = await this.pokemonModel.create(createPokemonDto);

    return pokemon;
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pokemon`;
  }

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
