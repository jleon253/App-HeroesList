import { Component, OnInit } from '@angular/core';
import { HeroeModel } from '../../models/heroe.model';
import { NgForm } from '@angular/forms';
import {HeroesService} from '../../services/heroes.service';
import Swal from 'sweetalert2';
import {Observable} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-heroe',
  templateUrl: './heroe.component.html',
  styleUrls: ['./heroe.component.css'],
})
export class HeroeComponent implements OnInit {

  heroe = new HeroeModel();
  isNew = true;

  constructor(private heroesService: HeroesService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== 'nuevo') {
      this.isNew = false;
      this.heroesService.getHeroeById(id).subscribe( (resp: HeroeModel) => {
        this.heroe = resp;
        this.heroe.id = id;
      });
    } else {
      this.isNew = true;
    }
  }

  saveForm(myForm: NgForm) {
    if (myForm.invalid) {
      return;
    }

    Swal.fire({
      title: 'Espera',
      text: 'Guardando información',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();

    let peticion = new Observable<any>();
    if (this.heroe.id) {
      peticion = this.heroesService.updateHeroe(this.heroe);
    } else {
      peticion = this.heroesService.createHeroe(this.heroe);
    }
    peticion.subscribe(resp => {
      Swal.fire({
        title: this.heroe.nombre,
        text: 'Se actualizo correctamente',
        icon: 'success',
        confirmButtonText: 'Continuar'
      }).then(resp => {
        this.router.navigate(['/heroes']);
      });
    });
  }
}
