import "./Card.css";

const Card = ({title, desc, img}) => {
  return (
    <div className="card">
      <img
        src={img}
        alt="Example"
        className="card-img"
      />
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        <p className="card-desc">
          {desc}
        </p>
        <div className="card-actions">
          <button className="btn btn-primary">Read</button>
          <button className="btn btn-secondary">Detail</button>
        </div>
      </div>
    </div>
  );
};

export default Card;
