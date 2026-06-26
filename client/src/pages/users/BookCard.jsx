export default function BookCard({ book, cart, userQuota, addToCart }) {
  const isAvailable = book.copies_available > 0;
  const isBookInCart = cart.some((item) => item.id === book.id);
  const isAlreadyBorrowed = userQuota.activeBookIds.includes(book.id);
  const isLimitReached = userQuota.totalBorrowed + cart.length >= 3;

  let buttonText = "Prendre ce livre";
  let buttonStyles =
    "bg-white text-slate-900 hover:bg-white/90 active:scale-95";
  let isButtonDisabled = false;

  if (isBookInCart) {
    buttonText = "Dans le panier";
    buttonStyles =
      "bg-amber-400/25 text-amber-200 border border-amber-400/40 cursor-default";
    isButtonDisabled = true;
  } else if (isAlreadyBorrowed) {
    buttonText = "Déjà en votre possession";
    buttonStyles =
      "bg-rose-500/25 text-rose-200 border border-rose-500/40 cursor-not-allowed";
    isButtonDisabled = true;
  } else if (!isAvailable) {
    buttonText = "Rupture de stock";
    buttonStyles =
      "bg-white/10 text-white/30 border border-white/15 cursor-not-allowed";
    isButtonDisabled = true;
  } else if (isLimitReached) {
    buttonText = "Quota max atteint (3)";
    buttonStyles =
      "bg-white/5 text-white/20 border border-white/10 cursor-not-allowed";
    isButtonDisabled = true;
  }

  return (
    <div
      className="relative rounded overflow-hidden flex flex-col justify-between h-96 group"
      style={{
        backgroundImage: `url(${book.cover_image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/90" />

      <div className="relative z-10 p-4 flex flex-col justify-end h-full">
        <h3 className="text-sm font-bold text-white">{book.title}</h3>

        <p className="text-white/70 text-sm my-2">{book.description}</p>
        <p className="text-white font-semibold text-sm ">{book.author}</p>

        <button
          disabled={isButtonDisabled}
          onClick={() => addToCart(book)}
          className={`mt-4 py-2 rounded ${buttonStyles}`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
