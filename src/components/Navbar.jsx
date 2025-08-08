import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Navbar.css";

const Navbar = () => {
  const state = useSelector((state) => state.handleCart);
  const cartCount = state.reduce((sum, item) => sum + (item.qty || 0), 0);
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white navbar-elevated py-3 sticky-top">
      <div className="container">
        <NavLink className="navbar-brand fw-bold fs-4 px-2" to="/">
          {" "}
          React Ecommerce
        </NavLink>
        <button
          className="navbar-toggler mx-2"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mx-auto my-2 align-items-center text-center">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Home{" "}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/product">
                Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact">
                Contact
              </NavLink>
            </li>
            <li className="nav-item d-none d-md-block">
              <div className="navbar-search mx-3">
                <i className="fa fa-search search-icon" />
                <input
                  className="form-control search-input"
                  type="search"
                  placeholder="Search products..."
                  aria-label="Search"
                />
              </div>
            </li>
          </ul>
          <div className="buttons text-center">
            <NavLink to="/login" className="btn btn-soft m-2">
              <i className="fa fa-sign-in-alt mr-1"></i> Login
            </NavLink>
            <NavLink to="/register" className="btn btn-soft m-2">
              <i className="fa fa-user-plus mr-1"></i> Register
            </NavLink>
            <NavLink to="/cart" className="btn btn-dark cart-btn m-2">
              <i className="fa fa-cart-shopping mr-2"></i> Cart
              <span className="cart-count ml-2">{cartCount}</span>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
