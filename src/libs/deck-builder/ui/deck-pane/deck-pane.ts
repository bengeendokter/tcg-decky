import { Component, input, output, OutputEmitterRef, type InputSignal } from "@angular/core";
import { TcgCard } from "../tcg-card/tcg-card.ts";
import type { TcgDexCollectionCard } from "../../model/tcg-dex-collection-card.ts";
import type { DeckCard } from "../../model/deck-card.ts";
import deleteIcon from "@material-symbols/svg-400/rounded/delete.svg";
import restartAltIcon from "@material-symbols/svg-400/rounded/restart_alt.svg";
import shareIcon from "@material-symbols/svg-400/rounded/share.svg";
import { IconComponent } from "../icon/icon.component.ts";

@Component({
  selector: "deck-pane",
  imports: [TcgCard, IconComponent],
  templateUrl: "./deck-pane.html",
  styleUrl: "./deck-pane.css",
})
export class DeckPane {
  public readonly deckName: InputSignal<string> = input.required();
  public readonly totalCardQuantity: InputSignal<number> = input.required();
  public readonly existingDeck: InputSignal<boolean> = input.required();
  public readonly deckCards: InputSignal<DeckCard[]> = input.required();
  protected readonly deleteIcon: string = deleteIcon;
  protected readonly restartAltIcon: string = restartAltIcon;
  protected readonly shareIcon: string = shareIcon;
  public readonly updateCollectionCardDeck: OutputEmitterRef<void> = output();
  public readonly addCollectionCardDeck: OutputEmitterRef<void> = output();
  public readonly openLoadDeckDialog: OutputEmitterRef<void> = output();
  public readonly reset: OutputEmitterRef<void> = output();
  public readonly deleteCollectionCardDeck: OutputEmitterRef<void> = output();
  public readonly openLimitlessDeckBuilder: OutputEmitterRef<void> = output();
  public readonly openCardDetail: OutputEmitterRef<TcgDexCollectionCard> = output();
}
