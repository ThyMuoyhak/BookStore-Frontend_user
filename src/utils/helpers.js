import { CURRENCY } from "../config";

export const PLACEHOLDER_IMAGE =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='800' viewBox='0 0 600 800'><rect width='100%' height='100%' fill='#f5f5f4'/><g fill='#d6d3d1'><rect x='240' y='300' width='120' height='160' rx='10'/><path d='M240 310 h120 M240 330 h120 M240 350 h80'/></g><text x='50%' y='520' font-family='Inter, sans-serif' font-size='26' fill='#a8a29e' text-anchor='middle'>No image</text></svg>`
  );

export function formatPrice(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return CURRENCY + "0.00";
  return CURRENCY + n.toFixed(2);
}

export function primaryImage(book) {
  if (!book || !book.images || !book.images.length) return PLACEHOLDER_IMAGE;
  const primary = book.images.find((i) => Number(i.is_primary) === 1) || book.images[0];
  return primary.image_url || PLACEHOLDER_IMAGE;
}
