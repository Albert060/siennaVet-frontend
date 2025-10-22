import { Component } from '@angular/core';
import { WhatsAppComponent } from "../../icons/whatsapp";
import { FacebookComponent } from "../../icons/facebook";
import { InstagramComponent } from "../../icons/instagram";
import { GmailComponent } from "../../icons/email";
import { TikTokComponent } from "../../icons/tiktok";

@Component({
  selector: 'app-contact',
  imports: [WhatsAppComponent, FacebookComponent, InstagramComponent, GmailComponent, TikTokComponent],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {

}
