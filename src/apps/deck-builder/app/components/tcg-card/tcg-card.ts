import { Component, input, type InputSignal } from "@angular/core";

@Component({
	selector: 'tcg-card',
	imports: [],
	templateUrl: './tcg-card.html',
	styleUrl: './tcg-card.css',
})
export class TcgCard {
	public readonly quantity: InputSignal<number | undefined> = input();
}
