import React, { useEffect, useMemo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useNavigate, useParams } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import toast from "react-hot-toast";

import { Footer, Navbar } from "../components";
import "./Product.css";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("Black/Gray");
  const [selectedSize, setSelectedSize] = useState("M");
  const [activeImage, setActiveImage] = useState("");
  const [wishlisted, setWishlisted] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  useEffect(() => {
    const controller = new AbortController();
    const getProduct = async () => {
      setLoading(true);
      setLoading2(true);
      try {
        const response = await fetch(
          `https://fakestoreapi.com/products/${id}`,
          { signal: controller.signal }
        );
        const data = await response.json();
        setProduct(data);
        setActiveImage(data.image);
        setLoading(false);
        const response2 = await fetch(
          `https://fakestoreapi.com/products/category/${data.category}`,
          { signal: controller.signal }
        );
        const data2 = await response2.json();
        setSimilarProducts(data2);
        setLoading2(false);
      } catch (error) {
        if (error.name !== "AbortError") {
          // eslint-disable-next-line no-console
          console.error("Failed to load product", error);
        }
      }
    };
    getProduct();
    return () => controller.abort();
  }, [id]);

  // Helpers
  const renderStars = (rate = 0) => {
    const filled = Math.round(rate);
    return (
      <span className="product-stars">
        {Array.from({ length: 5 }).map((_, index) => (
          <i
            key={index}
            className={`fa fa-star ${
              index < filled ? "text-warning" : "text-muted"
            }`}
          />
        ))}
      </span>
    );
  };

  const formatPrice = (price) => {
    if (typeof price !== "number") return price;
    return price.toFixed(2);
  };

  const badge = useMemo(() => {
    if (!product || !product.price) return null;
    if ((product?.rating?.count || 0) > 300) return { label: "Bestseller" };
    if (product.price < 30) return { label: "Sale" };
    return { label: "New" };
  }, [product]);

  const oldPrice = useMemo(() => {
    if (!product || !product.price) return null;
    return product.price < 30 ? product.price * 1.3 : null;
  }, [product]);

  const discountPercent = useMemo(() => {
    if (!oldPrice) return null;
    return Math.round(((oldPrice - product.price) / oldPrice) * 100);
  }, [oldPrice, product]);

  const gallery = useMemo(() => {
    if (!product?.image) return [];
    // Using same image as placeholder thumbnails
    return [product.image, product.image, product.image];
  }, [product]);

  const colorOptions = useMemo(
    () => [
      { label: "Black/Gray", hex: "#2f3237" },
      { label: "Navy", hex: "#001f3f" },
      { label: "Olive", hex: "#6b8e23" },
    ],
    []
  );

  const truncate = (text, len) => {
    if (!text) return "";
    return text.length > len ? text.substring(0, len - 1) + "…" : text;
  };

  const Loading = () => {
    return (
      <>
        <div className="container my-5 py-2">
          <div className="mb-3 d-none d-md-block">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb bg-white px-0 mb-0">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/product">Products</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {truncate(product.title, 48)}
                </li>
              </ol>
            </nav>
          </div>
          <div className="row">
            <div className="col-md-6 py-3">
              <Skeleton height={400} width={400} />
            </div>
            <div className="col-md-6 py-5">
              <Skeleton height={30} width={250} />
              <Skeleton height={90} />
              <Skeleton height={40} width={70} />
              <Skeleton height={50} width={110} />
              <Skeleton height={120} />
              <Skeleton height={40} width={110} inline={true} />
              <Skeleton className="mx-3" height={40} width={110} />
            </div>
          </div>
        </div>
      </>
    );
  };

  const handleAddToCart = () => {
    for (let i = 0; i < Math.max(1, quantity); i += 1) {
      addProduct(product);
    }
    toast.success("Added to cart");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  const ShowProduct = () => {
    return (
      <>
        <div className="container my-5 py-2">
          <div className="row">
            {/* Left: Gallery */}
            <div className="col-md-6 col-sm-12 py-3">
              <div className="product-main-image d-flex align-items-center justify-content-center">
                {activeImage && (
                  <img
                    className="img-fluid"
                    src={activeImage}
                    alt={product.title}
                    width="500"
                    height="500"
                    style={{ objectFit: "contain", maxHeight: 500 }}
                  />
                )}
              </div>
              <div className="d-flex mt-3">
                {gallery.map((src, idx) => (
                  <button
                    key={`${src}-${idx}`}
                    type="button"
                    className={`product-thumb ${
                      activeImage === src ? "active" : ""
                    }`}
                    onClick={() => setActiveImage(src)}
                  >
                    <img src={src} alt={`thumb-${idx}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Details */}
            <div className="col-md-6 py-5 product-summary-sticky">
              <div className="mb-2">
                {badge && (
                  <span className="product-badge mr-2">{badge.label}</span>
                )}
                <span className="text-uppercase text-muted small">
                  {product.category}
                </span>
              </div>

              <h1 className="display-5 mb-3">{product.title}</h1>

              <div className="d-flex align-items-center mb-3">
                {renderStars(product?.rating?.rate)}
                <span className="ml-2">
                  {product?.rating?.rate?.toFixed?.(1)}
                </span>
                <span className="text-muted small ml-2">
                  {(product?.rating?.count || 0).toLocaleString()} reviews
                </span>
              </div>

              <div className="d-flex align-items-baseline mb-1">
                <h3 className="display-6 my-0">
                  $ {formatPrice(product.price)}
                </h3>
                {oldPrice && (
                  <span className="old-price ml-3">
                    $ {formatPrice(oldPrice)}
                  </span>
                )}
                {discountPercent ? (
                  <span className="badge badge-success ml-2">
                    Save {discountPercent}%
                  </span>
                ) : null}
              </div>
              <div className="text-success small mb-3">
                <span className="stock-dot mr-2" /> In stock
              </div>

              <p className="text-muted" style={{ maxWidth: 640 }}>
                {product.description}
              </p>

              {/* Options */}
              <div className="mb-3">
                <div className="mb-2 text-muted small">Color</div>
                {colorOptions.map((c) => (
                  <button
                    key={c.label}
                    className={`product-pill mr-2 mb-2 ${
                      selectedColor === c.label ? "selected" : ""
                    }`}
                    type="button"
                    aria-pressed={selectedColor === c.label}
                    onClick={() => setSelectedColor(c.label)}
                  >
                    <span
                      className="swatch-dot mr-2"
                      style={{ background: c.hex }}
                    />
                    {c.label}
                  </button>
                ))}
              </div>

              <div className="mb-3">
                <div className="mb-2 text-muted small">Size</div>
                {["S", "M", "L", "XL"].map((s) => (
                  <button
                    key={s}
                    className={`product-pill mr-2 mb-2 ${
                      selectedSize === s ? "selected" : ""
                    }`}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="mb-3">
                <div className="mb-2 text-muted small">Quantity</div>
                <div className="d-inline-flex align-items-center qty-control">
                  <button
                    type="button"
                    className="btn btn-light border"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    <i className="fa fa-minus" />
                  </button>
                  <span className="px-3">{quantity}</span>
                  <button
                    type="button"
                    className="btn btn-light border"
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    <i className="fa fa-plus" />
                  </button>
                </div>
                <span className="text-muted small ml-3">12 in stock</span>
              </div>

              {/* Actions */}
              <div className="d-flex mb-4">
                <button className="btn btn-dark mr-2" onClick={handleAddToCart}>
                  <i className="fa fa-shopping-cart mr-2" /> Add to Cart
                </button>
                <button
                  className="btn btn-light border mr-2"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </button>
                <button
                  className={`btn btn-light border ${
                    wishlisted ? "text-danger" : ""
                  }`}
                  aria-pressed={wishlisted}
                  onClick={() => {
                    setWishlisted((w) => !w);
                    toast.success(
                      wishlisted ? "Removed from wishlist" : "Added to wishlist"
                    );
                  }}
                >
                  <i
                    className={`fa ${wishlisted ? "fa-heart" : "fa-heart-o"}`}
                  />
                </button>
              </div>

              {/* Perks */}
              <div className="perk-box p-3 mb-3">
                <div className="d-flex align-items-center mb-2">
                  <i className="fa fa-truck mr-2" /> Free shipping on orders
                  over $50
                </div>
                <div className="d-flex align-items-center">
                  <i className="fa fa-undo mr-2" /> 30-day returns & 2-year
                  limited warranty
                </div>
              </div>

              <div className="secure-line text-muted small mb-3">
                <i className="fa fa-lock mr-2" /> Secure checkout — SSL
                encrypted
              </div>

              {/* Collapsible Details */}
              <details className="mb-2">
                <summary>Details</summary>
                <div className="text-muted small mt-2">
                  Premium materials and breathable fabric. Contrast raglan
                  sleeves and a three-button placket. Perfect for casual wear.
                </div>
              </details>
              <details>
                <summary>Shipping & returns</summary>
                <div className="text-muted small mt-2">
                  Ships in 2-3 business days. Free returns within 30 days of
                  delivery.
                </div>
              </details>
            </div>
          </div>
        </div>
      </>
    );
  };

  const Loading2 = () => {
    return (
      <>
        <div className="my-4 py-4">
          <div className="d-flex">
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
          </div>
        </div>
      </>
    );
  };

  const ShowSimilarProduct = () => {
    return (
      <>
        <div className="py-4 my-4">
          <div className="d-flex">
            {similarProducts.map((item) => {
              return (
                <div key={item.id} className="card mx-4 text-center">
                  <img
                    className="card-img-top p-3"
                    src={item.image}
                    alt="Card"
                    height={300}
                    width={300}
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      {item.title.substring(0, 15)}...
                    </h5>
                  </div>
                  {/* <ul className="list-group list-group-flush">
                    <li className="list-group-item lead">${product.price}</li>
                  </ul> */}
                  <div className="card-body">
                    <Link
                      to={"/product/" + item.id}
                      className="btn btn-dark m-1"
                    >
                      Buy Now
                    </Link>
                    <button
                      className="btn btn-dark m-1"
                      onClick={() => addProduct(item)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">{loading ? <Loading /> : <ShowProduct />}</div>
        <div className="row my-5 py-5">
          <div className="d-none d-md-block">
            <h2 className="">You may also Like</h2>
            <Marquee pauseOnHover={true} pauseOnClick={true} speed={50}>
              {loading2 ? <Loading2 /> : <ShowSimilarProduct />}
            </Marquee>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;
