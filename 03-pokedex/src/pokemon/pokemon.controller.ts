import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { PaginationDto } from 'src/common/dto/pagination.dto';

// La url debe contener /api/v2
// No es bueno indicar en el @Controler /api/v2/pokemon, porque si tuviéramos unos 10 endpoints tendríamos que hacer
// muchos cambios.
// Una forma de hacerlo es en main.ts
@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  // Si queremos que con un POST, en vez de devolvernos un 201 nos devuelva un 200, utilizaremos @HttpCode(200)
  // En vez de indicar el número, Nest también tiene constantes con esos valores, donde HttpStatus.OK es el valor 200.
  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.create(createPokemonDto);
  }

  // Para poder paginar hay que jugar con los métodos de mongo .limit(x) y .skip(y)
  // limit(5) devuelve los siguientes 5 documentos.
  // skip(3) significa que empezaremos a devolver a partir del 4 documento.
  //
  // Necesitaremos pasar estos valores como query parameters.
  //
  // Para obtener todos los query parameters usaremos el decorador @Query()
  // Siempre vendrán como string.
  // El problema de estos query parameters es que son opcionales y que debemos validarlos.
  // Usaremos un nuevo dto para ello y como va a ser muy genérico lo crearemos en el módulo common.
  //
  // PROBLEMA: En Postman, esta url: http://localhost:3000/api/v2/pokemon?limit=10
  // provoca los siguientes errores:
  //          "limit must not be less than 1",
  //          "limit must be a positive number";
  // porque los query parameters llegan como string y no hay ninguna conversión a número.
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    console.log({ paginationDto });
    return this.pokemonService.findAll();
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    // term: término de búsqueda
    return this.pokemonService.findOne(term);
  }

  @Patch(':term')
  update(
    @Param('term') term: string,
    @Body() updatePokemonDto: UpdatePokemonDto,
  ) {
    return this.pokemonService.update(term, updatePokemonDto);
  }

  // Vamos a asegurarnos de que se envía un mongoId usando un CustomPipe.
  // No existe ningún ParseMongoIdPipe, así que lo crearemos nosotros.
  // Como no tiene nada que ver con un pokemon, sino que se podría usar en cualquier sitio,
  // vamos a crearlo en el módulo common (de comunes)
  // Creamos el módulo common con el comando: nest g mo common
  // Para crear el pipe usamos el comando: nest g pi common/pipes parseMongoId --no-spec
  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.pokemonService.remove(id);
  }
}
