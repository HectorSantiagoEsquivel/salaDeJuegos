import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';
import { Pokemon } from '../interfaces/pokemon';
@Injectable({
  providedIn: 'root'
})
export class PreguntadosService {

  constructor(private http: HttpClient) { }

  obtenerPokemon() : Observable<Pokemon | undefined>
  {
    const id = Math.floor(Math.random() * 720) + 1;
    const urlWithId = `https://pokeapi.co/api/v2/pokemon/${id}`;

    return this.http.get<Pokemon>(urlWithId).pipe(
      catchError( (error) =>{
        console.log(error)
        return of (undefined)
      })
    )
  }

  obtenerOpcionesPokemon(): Observable<Pokemon[]>{
    return this.http.get<any>('https://pokeapi.co/api/v2/pokemon/?limit=500').pipe(
      map(response => response.results)
    );
    
  } 

}
