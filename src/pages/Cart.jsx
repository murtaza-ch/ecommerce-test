import React, { useMemo, useState } from "react";
import { Footer, Navbar } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { addCart, delCart, removeLine, clearCart } from "../redux/action";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import "./Cart.css";

const Cart = () => {
  const state = useSelector((state) => state.handleCart);
  const dispatch = useDispatch();

  const EmptyCart = () => {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12 py-5 bg-light text-center">
            <h4 className="p-3 display-5"> Your Cart is Empty </h4>
            <Link to="/" className="btn  btn-outline-dark mx-4">
              <i className="fa fa-arrow-left"></i> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const addItem = (product) => {
    dispatch(addCart(product));
  };
  const removeItem = (product) => {
    dispatch(delCart(product));
  };

  const [promo, setPromo] = useState("");
  const [shippingMethod, setShippingMethod] = useState("standard");

  const { subtotal, totalItems } = useMemo(() => {
    let s = 0;
    let items = 0;
    state.forEach((item) => {
      s += item.price * item.qty;
      items += item.qty;
    });
    return { subtotal: s, totalItems: items };
  }, [state]);

  const shipping = useMemo(() => {
    if (shippingMethod === "express") return 12.99;
    if (subtotal >= 50) return 0;
    return 6.99;
  }, [shippingMethod, subtotal]);

  const discount = useMemo(() => {
    if (promo.toUpperCase() === "SAVE10") return Math.min(subtotal * 0.1, 50);
    if (promo.toUpperCase() === "FREESHIP") return Math.min(shipping, 6.99);
    return 0;
  }, [promo, subtotal, shipping]);

  const tax = useMemo(
    () => Math.round(subtotal * 0.08 * 100) / 100,
    [subtotal]
  );

  const total = useMemo(
    () => Math.max(0, subtotal - discount) + shipping + tax,
    [subtotal, discount, shipping, tax]
  );

  const ShowCart = () => {
    return (
      <>
        <section className="cart-section">
          <div className="container py-5">
            <div className="row">
              {/* Items list */}
              <div className="col-lg-8">
                <div className="cart-card p-3 p-md-4 mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h3 className="h5 mb-1">Items ({totalItems})</h3>
                      <small className="text-muted">
                        Review your items and complete your purchase.
                      </small>
                    </div>
                    <button
                      className="btn btn-sm btn-outline-light"
                      onClick={() => {
                        dispatch(clearCart());
                        toast.success("Cart cleared");
                      }}
                    >
                      Clear cart
                    </button>
                  </div>

                  {state.map((item) => (
                    <div
                      key={item.id}
                      className="cart-line d-flex align-items-center py-3"
                    >
                      <img
                        className="line-thumb"
                        src={item.image}
                        alt={item.title}
                      />
                      <div className="flex-grow-1 ml-3">
                        <div className="line-head d-flex justify-content-between align-items-center">
                          <div className="line-title">{item.title}</div>
                          <div className="text-right">
                            <div className="text-muted small">Line total</div>
                            <div className="font-weight-bold">
                              $ {(item.price * item.qty).toFixed(2)}
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center mt-2">
                          <div className="qty-group">
                            <button
                              className="btn btn-sm btn-light"
                              onClick={() => removeItem(item)}
                            >
                              <i className="fa fa-minus" />
                            </button>
                            <span className="mx-3">{item.qty}</span>
                            <button
                              className="btn btn-sm btn-light"
                              onClick={() => addItem(item)}
                            >
                              <i className="fa fa-plus" />
                            </button>
                          </div>
                          <button
                            className="btn btn-sm btn-link text-muted ml-3"
                            onClick={() => dispatch(removeLine(item))}
                          >
                            <i className="fa fa-trash" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="col-lg-4">
                <div className="cart-card p-3 p-md-4 mb-4">
                  <h3 className="h5 mb-3">Order Summary</h3>

                  {/* Progress / Free shipping */}
                  <div className="free-ship d-flex align-items-center mb-3">
                    <i className="fa fa-truck mr-2" />
                    <span>
                      You {subtotal >= 50 ? "unlocked" : "are close to"} free
                      shipping
                    </span>
                  </div>
                  <div className="progress mb-3" style={{ height: 6 }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${Math.min(100, (subtotal / 50) * 100)}%`,
                      }}
                    ></div>
                  </div>

                  {/* Promo */}
                  <div className="input-group input-group-sm mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="SAVE10 or FREESHIP"
                      value={promo}
                      onChange={(e) => setPromo(e.target.value)}
                    />
                    <div className="input-group-append">
                      <button
                        className="btn btn-outline-light"
                        type="button"
                        onClick={() => toast.success("Code applied")}
                      >
                        Apply
                      </button>
                    </div>
                  </div>

                  {/* Shipping method */}
                  <div className="mb-3">
                    <div className="text-muted small mb-2">Shipping method</div>
                    <div
                      className={`ship-option ${
                        shippingMethod === "standard" ? "active" : ""
                      }`}
                      onClick={() => setShippingMethod("standard")}
                    >
                      <span>Standard (3-5 days)</span>
                      <span>$ 6.99</span>
                    </div>
                    <div
                      className={`ship-option ${
                        shippingMethod === "express" ? "active" : ""
                      }`}
                      onClick={() => setShippingMethod("express")}
                    >
                      <span>Express (1-2 days)</span>
                      <span>$ 12.99</span>
                    </div>
                  </div>

                  {/* Price breakdown */}
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Discounts</span>
                    <span className="text-success">
                      - $ {discount.toFixed(2)}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span>$ {shipping.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax (est.)</span>
                    <span>$ {tax.toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>$ {total.toFixed(2)}</span>
                  </div>

                  <Link to="/checkout" className="btn btn-light btn-block mt-3">
                    Go to checkout <span className="ml-1">→</span>
                  </Link>
                  <button
                    className="btn btn-outline-light btn-block mt-2"
                    onClick={() => toast("Continuing shopping")}
                  >
                    Continue shopping
                  </button>
                  <div className="secure-line mt-3 text-muted small">
                    <i className="fa fa-lock mr-2" /> Secure checkout and
                    encrypted payments
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Your Cart</h1>
        {state.length > 0 ? <ShowCart /> : <EmptyCart />}
      </div>
      <Footer />
    </>
  );
};

export default Cart;
