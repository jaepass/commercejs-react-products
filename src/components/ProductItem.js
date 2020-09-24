import React, { Component } from "react";
import PropTypes from 'prop-types';

class ProductItem extends Component {

    render() {
        const { product } = this.props
        const reg = /(<([^>]+)>)/gi;
      
        return (
          <div className="product__card">
            <img className="product__image" src={product.media.source} alt={product.name} />
            <div className="product__info">
                <h4 className="product__name">{product.name}</h4>
                <p className="product__description">
                {(product.description || "").replace(reg, "")}
                </p>
                <div className="product__details">
                    <p className="product__price">
                    {product.price.formatted_with_symbol}
                    </p>
                </div>
            </div>
          </div>
        );
    }
  };


export default ProductItem;

ProductItem.propTypes = {
    product: PropTypes.object,
};