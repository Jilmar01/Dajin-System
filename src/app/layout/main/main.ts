import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menubar } from '../menubar/menubar';

@Component({
  imports: [
    RouterOutlet,
    Menubar
  ],
  selector: 'app-main',
  styleUrl: './main.css',
  templateUrl: './main.html',
})
export class Main { }
