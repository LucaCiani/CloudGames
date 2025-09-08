export default function ProductInfo({ name, vote, developer }) {
  return (
    <>
      <h1 className="mb-3">{name}</h1>
      <div className="mb-3">
        <span className="me-2">
          ⭐ {parseFloat(vote).toString()}
        </span>
        <span className="text-secondary">
          Developer: {developer}
        </span>
      </div>
    </>
  );
}