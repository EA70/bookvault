import BookCard from "./BookCard";

export default function BookGrid({ books, cart, userQuota, addToCart }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          cart={cart}
          userQuota={userQuota}
          addToCart={addToCart}
        />
      ))}
    </div>
  );
}
