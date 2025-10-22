import { Component } from '@angular/core';
import { Header } from "../../components/header/header";
import { Hero } from "../../components/hero/hero";
import { About } from "../../components/about/about";
import { Service } from "../../components/service/service";
import { Contact } from "../../components/contact/contact";
import { Footer } from "../../components/footer/footer";

@Component({
  selector: 'app-landing',
  imports: [Header, Hero, About, Service, Contact, Footer],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing {

}
