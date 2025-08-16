import { useMemo, useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import produkList from "../data/produkList";

export default function HeroPage() {
  // --- CART STATE ---
  // shape: { [namaProduk]: { qty, harga } }
  const [cart, setCart] = useState({});

  const addToCart = (item) => {
    setCart((prev) => {
      const current = prev[item.nama];
      const qty = (current?.qty || 0) + 1;
      return { ...prev, [item.nama]: { qty, harga: item.harga } };
    });
  };

  const removeOne = (nama) => {
    setCart((prev) => {
      const current = prev[nama];
      if (!current) return prev;
      if (current.qty <= 1) {
        const { [nama]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [nama]: { ...current, qty: current.qty - 1 } };
    });
  };

  const clearCart = () => setCart({});

  const cartItems = useMemo(
    () =>
      Object.entries(cart).map(([nama, v]) => ({
        nama,
        qty: v.qty,
        harga: v.harga,
        subtotal: v.qty * v.harga,
      })),
    [cart]
  );

  const totalQty = useMemo(
    () => cartItems.reduce((s, i) => s + i.qty, 0),
    [cartItems]
  );
  const totalPrice = useMemo(
    () => cartItems.reduce((s, i) => s + i.subtotal, 0),
    [cartItems]
  );

  // --- WHATSAPP CHECKOUT ---
  const PHONE = "6285799857403"; // ganti ke nomor WA kamu
  const waText = useMemo(() => {
    if (cartItems.length === 0)
      return "Halo, saya ingin bertanya tentang produk.";
    const lines = cartItems
      .map(
        (i) =>
          `- ${i.nama} x${
            i.qty
          } @ Rp${i.harga.toLocaleString()} = Rp${i.subtotal.toLocaleString()}`
      )
      .join("\n");
    return `Halo, saya ingin pesan:\n${lines}\n\nTotal: Rp${totalPrice.toLocaleString()}\n\nNama:\nAlamat:\nCatatan:`;
  }, [cartItems, totalPrice]);
  const waLink = `https://wa.me/${PHONE}?text=${encodeURIComponent(waText)}`;

  // --- PAGINATION STATE ---
  const [page, setPage] = useState(1);
  const pageSize = 6; // tampilkan 6 produk per halaman (ubah sesuai selera)

  const totalPages = Math.ceil(produkList.length / pageSize);
  const start = (page - 1) * pageSize;
  const currentItems = produkList.slice(start, start + pageSize);

  // jaga-jaga kalau jumlah produk berubah
  useEffect(() => {
    if (page > totalPages) setPage(totalPages || 1);
  }, [totalPages]);

  return (
    <section className="relative overflow-hidden">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-2">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          {/* LEFT: Copy & CTA */}
          <div>
            <span className="badge badge-primary badge-lg mb-4">
              Toko Online Pribadi
            </span>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Belanja Mudah,
              <span className="text-primary"> Harga Bersahabat</span>
            </h1>
            <p className="mt-4 max-w-xl text-base-content/70">
              Koleksi produk pilihan untuk kebutuhan harianmu. Pesan
              sekarang—bisa bayar COD atau transfer. Kirim cepat, packing aman.
            </p>

            {/* CTA */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href="#produk" className="btn btn-primary btn-wide">
                Belanja Sekarang
              </a>
              <a
                href={`https://wa.me/${PHONE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-success btn-wide"
              >
                <FaWhatsapp className="text-lg" />
                Chat WhatsApp
              </a>
            </div>

            {/* Trust bar */}
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <div className="badge badge-outline">COD</div>
                <span className="text-sm text-base-content/70">
                  Bayar di tempat
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="badge badge-outline">✔</div>
                <span className="text-sm text-base-content/70">
                  Produk terkurasi
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="badge badge-outline">⚡</div>
                <span className="text-sm text-base-content/70">
                  Kirim cepat
                </span>
              </div>
            </div>

            {/* CART SUMMARY (ganti search bar) */}
            <div className="mt-8 w-full max-w-xl">
              <div className="card bg-base-100 border shadow-sm">
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <h2 className="card-title text-lg">Pesananmu</h2>
                    <div className="badge">{totalQty} item</div>
                  </div>

                  {cartItems.length === 0 ? (
                    <p className="text-sm text-base-content/60">
                      Belum ada item. Klik <b>Beli</b> pada produk di sebelah.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {cartItems.map((i) => (
                        <li
                          key={i.nama}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{i.nama}</span>
                            <div className="join">
                              <button
                                className="btn btn-xs join-item"
                                onClick={() => removeOne(i.nama)}
                                aria-label={`Kurangi ${i.nama}`}
                              >
                                -
                              </button>
                              <button
                                className="btn btn-xs btn-ghost join-item"
                                disabled
                              >
                                {i.qty} pcs
                              </button>
                              <button
                                className="btn btn-xs join-item"
                                onClick={() =>
                                  addToCart({ nama: i.nama, harga: i.harga })
                                }
                                aria-label={`Tambah ${i.nama}`}
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div className="text-sm tabular-nums">
                            Rp{i.subtotal.toLocaleString()}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="divider my-2" />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg tabular-nums">
                      Rp{totalPrice.toLocaleString()}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row gap-2">
                    <button onClick={clearCart} className="btn btn-outline">
                      Reset
                    </button>
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-success flex-1"
                    >
                      <FaWhatsapp className="text-lg" />
                      Checkout via WhatsApp
                    </a>
                  </div>

                  <p className="text-xs text-base-content/60">
                    * Tombol WhatsApp akan membuka chat berisi daftar pesananmu.
                    Lengkapi nama & alamat di pesan sebelum kirim.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Produk grid dalam mockup */}
          <div id="produk" className="relative">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-base-200/60 blur-xl" />
            <div className="mockup-browser border bg-base-300 shadow-xl">
              <div className="mockup-browser-toolbar">
                <div className="input">tokomu.id/produk-terbaru</div>
              </div>
              <div className="bg-base-100 p-4">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {currentItems.map((item) => (
                    <div
                      key={item.nama}
                      className="card card-compact bg-base-100 shadow hover:shadow-lg transition"
                    >
                      <figure>
                        <img
                          src={item.gambar}
                          alt={item.nama}
                          className="h-28 w-full object-cover sm:h-32"
                          loading="lazy"
                        />
                      </figure>
                      <div className="card-body">
                        <h3 className="card-title text-sm">{item.nama}</h3>
                        <p className="text-xs text-base-content/60">
                          {item.deskripsi}
                        </p>
                        <div className="card-actions justify-between items-center">
                          <span className="font-bold">
                            Rp{item.harga.toLocaleString()}
                          </span>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => addToCart(item)}
                          >
                            Beli
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                  {/* Pagination */}
                  <div className="mt-4 flex items-center justify-center">
                    <div className="join">
                      <button
                        className="btn join-item"
                        onClick={() => setPage(1)}
                        disabled={page === 1}
                        aria-label="Halaman pertama"
                      >
                        «
                      </button>
                      <button
                        className="btn join-item"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        aria-label="Sebelumnya"
                      >
                        ‹
                      </button>

                      {/* Nomor halaman sederhana */}
                      {Array.from({ length: totalPages }).map((_, i) => {
                        const n = i + 1;
                        return (
                          <button
                            key={n}
                            className={`btn join-item ${
                              n === page ? "btn-active" : ""
                            }`}
                            onClick={() => setPage(n)}
                          >
                            {n}
                          </button>
                        );
                      })}

                      <button
                        className="btn join-item"
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page === totalPages}
                        aria-label="Berikutnya"
                      >
                        ›
                      </button>
                      <button
                        className="btn join-item"
                        onClick={() => setPage(totalPages)}
                        disabled={page === totalPages}
                        aria-label="Halaman terakhir"
                      >
                        »
                      </button>
                    </div>
                  </div>
                {/* Info kecil */}
                <p className="mt-3 text-xs text-base-content/50">
                  * Klik <b>Beli</b> untuk menambahkan ke pesanan.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating WhatsApp (mobile) */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-success btn-circle fixed bottom-4 right-4 shadow-lg lg:hidden"
          aria-label="Checkout via WhatsApp"
        >
          <FaWhatsapp className="text-xl" />
        </a>
      </div>
    </section>
  );
}
