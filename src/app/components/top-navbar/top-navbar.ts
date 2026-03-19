import { Component } from '@angular/core';
import { MaterialModule } from '../../modules/material-module';

@Component({
  selector: 'app-top-navbar',
  standalone: true,
  imports: [
    MaterialModule
  ],
  templateUrl: './top-navbar.html',
  styleUrls: ['./top-navbar.scss']
})
export class TopNavbar {

}