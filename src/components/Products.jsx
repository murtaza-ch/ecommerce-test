import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Products.css";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(data);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  useEffect(() => {
    const controller = new AbortController();
    const getProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://fakestoreapi.com/products/", {
          signal: controller.signal,
        });
        const json = await response.json();
        setData(json);
        setFilter(json);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to load products", error);
        }
      } finally {
        setLoading(false);
      }
    };

    getProducts();
    return () => controller.abort();
  }, []);

  const Loading = () => {
    return (
      <>
        <div className="col-12 py-5 text-center">
          <Skeleton height={40} width={560} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
      </>
    );
  };

  const filterProduct = (cat) => {
    const updatedList = data.filter((item) => item.category === cat);
    setFilter(updatedList);
    setActiveFilter(cat);
  };

  const getBadgeForProduct = (product) => {
    const reviewCount = product?.rating?.count || 0;
    if (reviewCount > 300) return { label: "Bestseller", icon: "fa fa-bolt" };
    if (product?.price < 30) return { label: "Sale", icon: "fa fa-tags" };
    return { label: "New", icon: "fa fa-star" };
  };

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

  const ShowProducts = () => {
    return (
      <>
        <div className="filter-group py-4">
          <button
            className={`filter-pill ${activeFilter === "All" ? "active" : ""}`}
            onClick={() => {
              setFilter(data);
              setActiveFilter("All");
            }}
          >
            All
          </button>
          <button
            className={`filter-pill ${
              activeFilter === "men's clothing" ? "active" : ""
            }`}
            onClick={() => filterProduct("men's clothing")}
          >
            Men's Clothing
          </button>
          <button
            className={`filter-pill ${
              activeFilter === "women's clothing" ? "active" : ""
            }`}
            onClick={() => filterProduct("women's clothing")}
          >
            Women's Clothing
          </button>
          <button
            className={`filter-pill ${
              activeFilter === "jewelery" ? "active" : ""
            }`}
            onClick={() => filterProduct("jewelery")}
          >
            Jewelery
          </button>
          <button
            className={`filter-pill ${
              activeFilter === "electronics" ? "active" : ""
            }`}
            onClick={() => filterProduct("electronics")}
          >
            Electronics
          </button>
        </div>

        {filter.map((product) => {
          const badge = getBadgeForProduct(product);
          const hasSale = badge.label === "Sale";
          const oldPrice = hasSale ? product.price * 1.3 : null;
          return (
            <div
              id={product.id}
              key={product.id}
              className="col-lg-4 col-md-6 col-sm-6 col-12 mb-4"
            >
              <div className="product-card card border-0 shadow-sm h-100">
                <div className="position-relative p-3 pb-0">
                  <span className="product-badge">
                    <i className={`${badge.icon} mr-1`} /> {badge.label}
                  </span>
                  <button
                    type="button"
                    className="wishlist-btn"
                    aria-label="Add to wishlist"
                  >
                    <i className="fa fa-heart" />
                  </button>
                  <div className="product-image-wrap">
                    <img
                      className="product-image"
                      src={product.image}
                      alt={product.title}
                    />
                  </div>
                </div>

                <div className="card-body d-flex flex-column">
                  <h5 className="product-title mb-2">{product.title}</h5>
                  <div className="d-flex align-items-center mb-2">
                    {renderStars(product?.rating?.rate)}
                    <span className="ml-2 text-muted small">
                      {(product?.rating?.count || 0).toLocaleString()} reviews
                    </span>
                  </div>
                  <p className="text-muted small mb-3">
                    {product.description.substring(0, 110)}...
                  </p>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <span className="h5 mb-0">
                        $ {formatPrice(product.price)}
                      </span>
                      {oldPrice && (
                        <span className="old-price ml-2">
                          $ {formatPrice(oldPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="product-actions d-flex mt-auto">
                    <button
                      className="btn btn-dark flex-grow-1 mr-2"
                      onClick={() => {
                        toast.success("Added to cart");
                        addProduct(product);
                      }}
                    >
                      <i className="fa fa-shopping-cart mr-2" /> Add to Cart
                    </button>
                    <button
                      className="btn btn-light border flex-grow-1"
                      onClick={() => {
                        navigate(`/product/${product.id}`);
                      }}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  };
  return (
    <>
      <div className="container my-3 py-3">
        <div className="row">
          <div className="col-12">
            <h2 className="display-5 text-center">Latest Products</h2>
            <hr />
          </div>
        </div>
        <div className="row justify-content-center">
          {loading ? <Loading /> : <ShowProducts />}
        </div>
      </div>
    </>
  );
};

export default Products;
