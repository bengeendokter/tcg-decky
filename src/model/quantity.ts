type QuantityText = `${number}×`;

export function isQuantityText(text: string): text is QuantityText {
    return /^\d+×$/.test(text);
}