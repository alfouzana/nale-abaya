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

const SIZES = [52, 54, 56, 58, 60];
const SHIP = 25, FREE_SHIP = 500;
const sar = (n) => `${n.toLocaleString("ar-SA")} ر.س`;

const grid = document.querySelector("[data-grid]");
function render(filter = "الكل") {
  grid.innerHTML = products
    .filter((p) => filter === "الكل" || p.cat === filter)
    .map((p) => {
      const sizes = SIZES.map((z) => `<option>${z}</option>`).join("");
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
        <div class="mt-4 flex gap-2">
          <select data-size="${p.id}" aria-label="المقاس" class="rounded-full border border-stone-300 bg-white px-3 text-sm">${sizes}</select>
          <button data-add="${p.id}" class="flex-1 rounded-full bg-stone-900 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-700">أضيفي للسلة</button>
        </div>
      </article>`;
    })
    .join("");
}
render();

// cart
let cart = JSON.parse(localStorage.getItem("nale-cart") || "[]");
const $ = (q) => document.querySelector(q);
const $$ = (q) => document.querySelectorAll(q);
const save = () => localStorage.setItem("nale-cart", JSON.stringify(cart));

function step(name) {
  $$("[data-step]").forEach((el) => {
    el.classList.toggle("hidden", el.dataset.step !== name);
    el.classList.toggle("flex", el.dataset.step === name);
  });
  $("[data-cart-title]").textContent = { cart: "سلة المشتريات", checkout: "الدفع", done: "شكرًا لك" }[name];
}

function drawCart() {
  const count = cart.reduce((a, c) => a + c.qty, 0);
  const badge = $("[data-cart-count]");
  badge.textContent = count;
  badge.classList.toggle("hidden", !count);
  badge.classList.toggle("flex", !!count);

  const sub = cart.reduce((a, c) => a + c.qty * products.find((p) => p.id === c.id).price, 0);
  const ship = !sub || sub >= FREE_SHIP ? 0 : SHIP;
  $("[data-subtotal]").textContent = sar(sub);
  $("[data-shipping]").textContent = ship ? sar(ship) : "مجاني";
  $$("[data-total]").forEach((el) => (el.textContent = sar(sub + ship)));
  $("[data-to-checkout]").disabled = !count;

  $("[data-cart-items]").innerHTML = count
    ? cart
        .map((c, i) => {
          const p = products.find((x) => x.id === c.id);
          return `<div class="flex gap-4">
            <img src="${img(p.id, 200)}" alt="" class="h-24 w-20 rounded-xl object-cover" />
            <div class="flex-1 text-sm">
              <div class="flex justify-between"><p class="font-semibold">${p.name}</p><button data-rm="${i}" class="text-stone-400" aria-label="حذف">&times;</button></div>
              <p class="mt-1 text-stone-500">المقاس ${c.size}</p>
              <div class="mt-3 flex items-center justify-between">
                <div class="flex items-center gap-3 rounded-full border border-stone-300 px-3 py-1">
                  <button data-qty="${i}" data-d="1">+</button><span>${c.qty}</span><button data-qty="${i}" data-d="-1">−</button>
                </div>
                <span class="font-semibold">${sar(p.price * c.qty)}</span>
              </div>
            </div>
          </div>`;
        })
        .join("")
    : `<p class="pt-16 text-center text-stone-500">السلة فاضية، تصفّحي التشكيلة 🤍</p>`;
}

function openCart() {
  step("cart");
  $("[data-cart]").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}
function closeCart() {
  $("[data-cart]").classList.add("hidden");
  document.body.style.overflow = "";
}

document.addEventListener("click", (e) => {
  const t = e.target.closest("button, [data-cart-close]");
  if (!t) return;
  if (t.dataset.add) {
    const size = document.querySelector(`[data-size="${t.dataset.add}"]`).value;
    const hit = cart.find((c) => c.id === t.dataset.add && c.size === size);
    hit ? hit.qty++ : cart.push({ id: t.dataset.add, size, qty: 1 });
    save(); drawCart();
    const toast = $("[data-toast]");
    toast.style.opacity = 1;
    setTimeout(() => (toast.style.opacity = 0), 1400);
  } else if (t.dataset.qty) {
    const c = cart[+t.dataset.qty];
    c.qty += +t.dataset.d;
    if (c.qty < 1) cart.splice(+t.dataset.qty, 1);
    save(); drawCart();
  } else if (t.dataset.rm) {
    cart.splice(+t.dataset.rm, 1);
    save(); drawCart();
  } else if (t.hasAttribute("data-cart-open")) openCart();
  else if (t.hasAttribute("data-cart-close")) closeCart();
  else if (t.hasAttribute("data-to-checkout")) step("checkout");
  else if (t.hasAttribute("data-back")) step("cart");
});

$('[data-step="checkout"]').addEventListener("submit", (e) => {
  e.preventDefault();
  $("[data-order-no]").textContent = "#NL" + Math.floor(10000 + Math.random() * 89999);
  cart = []; save(); drawCart();
  e.target.reset();
  step("done");
});
drawCart();

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
