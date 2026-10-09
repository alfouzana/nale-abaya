import "./style.css";

const WA = "966550594909";
const img = (id, w = 800) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const products = [
  { name: "عباية لؤلؤ", cat: "مناسبات", price: 690, id: "1772474578035-bebcd90b355d", note: "أكمام مطرّزة باللؤلؤ والخرز" },
  { name: "عباية رمال", cat: "يومي", price: 420, id: "1760083545495-b297b1690672", note: "بيج بتطريز ناعم على الأطراف" },
  { name: "عباية ليل", cat: "مناسبات", price: 750, id: "1772474500365-c2c520545f44", note: "سوداء بورود بارزة وأساور دانتيل" },
  { name: "عباية نسيم", cat: "يومي", price: 380, id: "1752794673269-dc356838c5fd", note: "قصّة واسعة بلون محايد مريح" },
  { name: "عباية كحلي", cat: "عملي", price: 450, id: "1762605135326-5c4bcc5ef006", note: "كحلي هادئ يناسب الدوام" },
  { name: "عباية تباين", cat: "عملي", price: 520, id: "1772474557170-4818d01d7bca", note: "أسود وأبيض بخطوط عصرية" },
];

const grid = document.querySelector("[data-grid]");
function render(filter = "الكل") {
  grid.innerHTML = products
    .filter((p) => filter === "الكل" || p.cat === filter)
    .map((p) => {
      const msg = encodeURIComponent(`السلام عليكم، أبغى أطلب ${p.name} (${p.price} ر.س) من Nalé`);
      return `
      <article class="group">
        <div class="relative aspect-[3/4] overflow-hidden rounded-2xl bg-sand">
          <img src="${img(p.id)}" alt="${p.name}" loading="lazy" class="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          <span class="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium">${p.cat}</span>
        </div>
        <div class="mt-4 flex items-start justify-between gap-3">
          <div>
            <h3 class="font-semibold">${p.name}</h3>
            <p class="mt-1 text-sm text-stone-500">${p.note}</p>
          </div>
          <p class="whitespace-nowrap font-semibold text-brand">${p.price} ر.س</p>
        </div>
        <a href="https://wa.me/${WA}?text=${msg}" target="_blank" rel="noopener" class="mt-4 block rounded-full border border-stone-900 py-2.5 text-center text-sm font-semibold transition hover:bg-stone-900 hover:text-white">اطلبي عبر الواتساب</a>
      </article>`;
    })
    .join("");
}
render();

document.querySelectorAll("[data-filter]").forEach((b) =>
  b.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
    render(b.dataset.filter);
  })
);

document.querySelectorAll("[data-wa]").forEach((a) => {
  a.href = `https://wa.me/${WA}?text=${encodeURIComponent("السلام عليكم، عندي استفسار عن عبايات Nalé")}`;
});

const btn = document.querySelector("[data-nav-toggle]");
const menu = document.querySelector("[data-mobile-menu]");
btn?.addEventListener("click", () => menu?.classList.toggle("hidden"));
menu?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => menu.classList.add("hidden")));

document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = String(new Date().getFullYear())));
