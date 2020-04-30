import { Component, OnInit } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { HeroeModel } from '../../models/heroe.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  heroes: HeroeModel[] = [];
  cargando = false;

  constructor( private heroesService: HeroesService) { }

  ngOnInit() {
    this.cargando = true;
    this.heroesService.getHeroes().subscribe(resp => {
      this.heroes = resp;
      this.cargando = false;
    });
  }

  delete(heroe: HeroeModel, position: number) {
    Swal.fire({
      title: `¿Deseas quitar a ${heroe.nombre}?`,
      text: 'Esta acción no se puede revertir',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, quiero hacerlo',
      cancelButtonText: 'Creo que no',
      confirmButtonColor: '#dc3545'
    }).then(result => {
      if (result.value) {
        this.heroes.splice(position, 1);
        this.heroesService.deleteHeroe(heroe.id).subscribe();
        Swal.fire(
          'Realizado',
          'El heroe fue retirado',
          'success'
        );
      }
    });

  }

}
