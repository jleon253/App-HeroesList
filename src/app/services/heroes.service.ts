import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeroeModel } from '../models/heroe.model';

import { map, delay } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  url = 'https://heroesapp-crud-angular.firebaseio.com';

  constructor(private http: HttpClient) {
    console.log('Heroes Services - Listo');
  }


  /**
   * Permite crear un nuevo Heroe e insertarlo via POST a la BD en FireBase
   * @param newHeroe : Nuevo objeto sin ID establecido
   * @returns El mismo objeto con ID establecido (observable)
   */
  createHeroe(newHeroe: HeroeModel) {
    /*
    Se usa .json porque así lo trabaja FireBase
    La respuesta por parte de FireBase al post, es el id del nuevo objeto.
    Usando map(), transformo la respuesta del observable (petición HTTP) y asigno el id a newHeroe
    */
    return this.http.post(`${this.url}/heroes.json`, newHeroe).pipe(
      map((resp: any) => {
        newHeroe.id = resp.name;
        return newHeroe;
      })
    );
  }

  /**
   * Permite actualizar la información de un Heroe existente vía PUT, en Firebase
   * @param heroe : Referencia del heroe a actualizar
   * @returns : La acción para ejecutar (observable)
   */
  updateHeroe(heroe: HeroeModel) {
    const heroeTemp = {
      ...heroe
    };
    // El operador delete, elimina la propiedad de un objeto
    delete heroeTemp.id;
    return this.http.put(`${this.url}/heroes/${heroe.id}.json`, heroeTemp);
  }

  /**
   * Trae todos los héroes existentes.
   * Tiene un retraso de 1 seg, para dar efecto en la UI.
   * @returns : Los heroes existentes en FireBase, en forma de Array (FireBase retorna objects separados)
   */
  getHeroes() {
    return this.http.get(`${this.url}/heroes.json`).pipe(
      map(resp => this.convertToArrayHeroes(resp)),
      delay(1000)
    );
  }

  /**
   * Trae 1 heroe existente, especificado por su Id (Asignado en FireBase)
   * @param id : Id único por cada héroe
   */
  getHeroeById(id: string) {
    return this.http.get(`${this.url}/heroes/${id}.json`);
  }

  /**
   * Elimina 1 heroe existente, especificado por su Id (Asignado en FireBase)
   * @param id : Id único por cada héroe
   */
  deleteHeroe(id: string) {
    return this.http.delete(`${this.url}/heroes/${id}.json`);
  }

  /**
   * Permite convertir un grupo de objects Heroes en Array de objects Heroes
   * Los objects originales no contienen ID
   * Al nuevo array de objects, se le asigna el Id correspondiente
   * @param heroesObj : Conjunto de objects (separados)
   */
  private convertToArrayHeroes( heroesObj: object) {
    const heroes: HeroeModel[] = [];
    if (heroesObj === null) { return []; }
    Object.keys(heroesObj).forEach(key => {
      const heroeTemp: HeroeModel = heroesObj[key];
      heroeTemp.id = key;
      heroes.push(heroeTemp);
    });
    return heroes;
  }

}
