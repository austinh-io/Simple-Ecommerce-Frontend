import { formatCurrency } from '/scripts/utilities/commerceUtilities.js';
('use strict');

function cardOptionField(product, option) {
  let inputBackground = '';
  if (option.optionVisual.type == 'color') {
    inputBackground = `background-color: ${option.optionVisual.value};`;
  } else if (option.optionVisual.type == 'image') {
    inputBackground = `
        background-image: url(${baseUrl}/assets/images/productImages/${option.optionVisual.value}.jpg);
        background-position: center;
        background-size: cover;
      `;
  }

  return `
    <div>
      <input
        type="radio"
        id="option-${product.productId}-${option.optionId}"
        name="options-item-${product.productId}"
        value="option-${option.optionId}"
        data-productId="${product.productId}"
        data-optionid="${option.optionId}"
        onChange="handleProductOptionChange(event)"
        ${product.options.indexOf(option) == 0 ? 'checked' : ''}
        style="
          ${inputBackground};
        "
      />
      <label
        for="option-${product.productId}-${option.optionId}"
        class="hidden"
        >${option.optionLabel}</label
      >
    </div>
    `;
}

function getOptionStyleSizes(product, option) {
  let optionStyleSizes = [];

  for (let options of product.options) {
    if (
      options.optionVisual.value == option.optionVisual.value &&
      options.optionVisual.value == option.optionVisual.value
    ) {
      optionStyleSizes.push(options);
    }
  }
  return optionStyleSizes;
}

function cardOptionSelection(option) {
  return `
    <option value="${option.optionSize}" data-optionId=${option.optionId}>${option.optionSize}</option>
    `;
}

function cardOptionSelectionGroup(product, option) {
  let optionSelections = '';
  const optionStyleSizes = getOptionStyleSizes(product, option);
  for (let optionSize of optionStyleSizes) {
    optionSelections += cardOptionSelection(optionSize);
  }

  if (optionStyleSizes.length <= 1) {
    return '';
  } else
    return `
    <label for="product-size-select-${product.productId}" class="hidden">Size</label>
  
    <select
      class="product-size-selection"
      name="sizes"
      id="product-size-select-${product.productId}"
      data-productId=${product.productId}
      onChange="handleProductOptionChange(event)"
    >
      ${optionSelections}
    </select>
    `;
}

function getUniqueOptionStyles(product) {
  let uniqueOptionsByStyle = [];

  product.options.filter((option) => {
    if (
      uniqueOptionsByStyle.find((element) => {
        return (
          option.optionVisual.type == element.optionVisual.type &&
          option.optionVisual.value == element.optionVisual.value
        );
      })
    ) {
      return option;
    } else {
      uniqueOptionsByStyle.push(option);
    }
  });

  return uniqueOptionsByStyle;
}

function getProductFieldset(productOptions, product) {
  let cardOptionsFieldset = undefined;

  if (productOptions.length <= 1) {
    cardOptionsFieldset = '';
  } else {
    let cardProductOptions = '';

    for (let option of productOptions) {
      cardProductOptions += cardOptionField(product, option);
    }

    cardOptionsFieldset = `
      <fieldset class="product-fieldset">
        <legend class="hidden">Variant</legend>
  
        ${cardProductOptions}
  
      </fieldset>
      `;
  }

  return cardOptionsFieldset;
}

const productCardTemplate = function (product) {
  let cardOptionsSelections = cardOptionSelectionGroup(
    product,
    product.options[0]
  );
  let uniqueOptionsByStyle = getUniqueOptionStyles(product);
  let cardOptionsFieldset = getProductFieldset(uniqueOptionsByStyle, product);

  return `
    <div class="product" id="product-${product.productId}" data-productId=${
    product.productId
  }>
      <a
        class="product-image-container"
        style="
        background-image: url(${baseUrl}/assets/images/productImages/smaller_alt/${
    product.options[0].imageName
  }_smaller_alt.jpg);"
        href="productPage.html?productId=${product.productId}&optionId=${
    product.options[0].optionId
  }"
        >
          <img
          loading="lazy"
          class="product-image"
          src="${baseUrl}/assets/images/productImages/small/${
    product.options[0].imageName
  }_small.webp"
          />
      </a>
      <div class="product-info-container">
          <div class="product-brand">${product.brand}</div>
          <div class="product-title">
            <a href="productPage.html?productId=${product.productId}&optionId=${
    product.options[0].optionId
  }">
            ${product.title}
            </a>          
          </div>
          <div class="product-description">
            <p>
              ${product.description}
            </p>          
          </div>
  
          ${cardOptionsFieldset}
          ${cardOptionsSelections}
  
  
          <div class="product-price">
            <span class="product-price-value">${formatCurrency(
              product.options[0].price
            )}</span>
          </div>
  
          <div class="product-button-group" data-productId=${
            product.productId
          } data-optionid=${product.options[0].optionId}>
            <button
              class="button-product button-add"
              id="button-product-${
                product.productId + product.options[0].optionId
              }"
              onclick="addToCart(event); openCartMenu()"
            >
              ${catalogItemButtonText_Enabled}
            </button>
        </div>
      </div>
    </div>
  `;
};

const catalogProductTplCss = `
<style>
    @import url(/css/shared.css);

    h1, h2, h3, h4, h5, h6 {
        font-family: var(--font-title);
    }

    .product {
      display: flex;
      flex-direction: column;
      height: 100%;
      max-height: 38rem;
      max-width: 100%;

      overflow: hidden;
      border-radius: 3pt;
    }

    .product-image-container {
      overflow: hidden;
      aspect-ratio: 5/3;
      height: 100%;
      width: 100%;

      border-radius: 3pt;

      background-repeat: no-repeat;
      display: block;
    }

    a.product-image-container {
      backdrop-filter: blur(10px);
      background-size: cover;
      background-position: center;
    }

    img.product-image {
      transition: transform 0.25s ease;
    }

    img.product-image:hover {
      transform: scale(1.05);
    }

    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .product-info-container {
      display: flex;
      flex-direction: column;
      padding-top: 0.8rem;
      width: 100%;
    }

    .product-brand {
      font-size: 0.8rem;
      font-weight: 300;
      margin-bottom: -0.2rem;
    }

    .product-title {
      position: relative;
      font-size: 1.4rem;
      height: auto;

      text-transform: uppercase;
    }

    div.product-title a {
      position: relative;
      top: 0;
      font-weight: 500;
      color: inherit;
      text-decoration: none;
      transition: all 0.15s ease-out;
    }

    div.product-title a:hover {
      color: var(--color-accent);
      top: -0.2rem;
    }

    .product-description {
      font-size: 0.9rem;
      font-weight: 300;

      margin-block: 0.4rem;

      height: 100%;
    }

    .product-description p {
      display: -webkit-box;

      -webkit-line-clamp: 2;

      -webkit-box-orient: vertical;

      overflow: hidden;
    }

    .product-price {
      font-size: 1.2rem;
      margin-block: 0.6rem;
      font-weight: 200;
    }

    /* ----- Button ----- */

    .product-button-group {
      display: flex;
      flex-direction: column;
      align-items: start;
      justify-content: space-between;
    }

    .button-product {
      padding: 0.6rem;

      width: 100%;
      max-width: 12rem;

      font-size: 0.8rem;
      border: none;
      border-radius: 3pt;
      cursor: pointer;

      background-color: var(--color-font);
      color: var(--color-fg);
      font-weight: 700;
      text-transform: uppercase;

      border: 3px solid var(--color-font);

      transition: all 0.1s ease-in;
    }

    .button-product:hover {
      color: var(--color-font);
      background-color: var(--color-bg);
      border: 3px solid var(--color-accent);
    }

    .button-product:disabled {
      background-color: var(--color-disabled);
      border: 3px solid var(--color-disabled);
      color: var(--color-fg);

      cursor: default;
    }

    .button-product:disabled:hover {
      background-color: var(--color-disabled);
    }

    /* ----- Fieldset ----- */

    fieldset.product-fieldset {
      display: flex;
      align-items: center;
      justify-content: start;

      gap: 1rem;
      margin-block: 1rem;

      padding-inline: 0.4rem;

      border: 0;
    }

    .product-fieldset input[type='radio'] {
      appearance: none;
      width: 1.4rem;
      height: 1.4rem;
      outline-offset: 1px;
      border-radius: 50%;
      cursor: pointer;
      border: 1px solid var(--color-font);

      transition: all 0.1s ease-out;
    }

    .product-fieldset input[type='radio']:hover {
      outline: 3px solid var(--color-accent, currentColor);
      border: none;
    }

    .product-fieldset input[type='radio']:checked {
      outline: 3px solid var(--color-font, currentColor);
      border: none;
    }

    .product-fieldset input[type='radio']:checked:hover {
      outline: 3px solid var(--color-font, currentColor);
      cursor: default;
      border: none;
    }

    .product-fieldset input[type='radio']#light {
      --radio-color: rgb(223, 232, 238);
    }

    .product-fieldset input[type='radio']#dark {
      --radio-color: rgb(23, 28, 32);
    }

    .product-size-selection {
      font-size: 1.2rem;
      width: 4rem;
      max-width: 20rem;
      padding: 0.4rem;
      border: none;
      border-radius: 3pt;
      color: var(--color-font);
      background-color: var(--color-fg);
    }

</style>
`;

const catalogProductCardTPL = document.createElement('template');
catalogProductCardTPL.innerHTML = `
${catalogProductTplCss}

<div class="product" id="assign-me" data-productId=0>
      <a
        class="product-image-container"
        style="
        background-image: url(/assets/images/productImages/small_alt/item18-0_small_alt.png);"
        href="#"
        >
          <img
          loading="lazy"
          class="product-image"
          src="/assets/images/productImages/item18-0.jpg"
          />
      </a>
      <div class="product-info-container">
          <div class="product-brand">Product Brand</div>
          <div class="product-title">
            <a href="#">
            Product Title
            </a>          
          </div>
          <div class="product-description">
            <p>
              Product description.
            </p>          
          </div> 

  
  
          <div class="product-price">
            <span class="product-price-value">${formatCurrency(0)}</span>
          </div>
  
          <div class="product-button-group" data-productId="assign-me" data-optionid="assign-me">
            <button
              class="button-product button-add"
              id="button-product-assign-me"
              onclick="addToCart(event); openCartMenu()"
            >
              Button
            </button>
        </div>
      </div>
    </div>
`;

class catalogProduct extends HTMLElement {
  constructor() {
    super();

    this.showInfo = true;
    const shadowRoot = this.attachShadow({ mode: 'open' });
    const clone = catalogProductCardTPL.content.cloneNode(true);
    shadowRoot.append(clone);
    // shadowRoot.appendChild(catalogProductCardTPL.content.cloneNode(true));

    shadowRoot.getElementById('assign-me').setAttribute('id', 'amogus');

    shadowRoot.querySelector('h3').innerText = this.getAttribute('name');
    // this.shadowRoot.querySelector('img').src = this.getAttribute('avatar');
    // this.shadowRoot.querySelector('.wage').innerText = formatCurrency(
    //   this.getAttribute('wage')
    // );
  }

  toggleInfo() {
    this.showInfo = !this.showInfo;

    const info = this.shadowRoot.querySelector('.info');
    const toggleButton = this.shadowRoot.querySelector('#toggle-info');

    if (this.showInfo) {
      info.style.display = 'block';
      toggleButton.innerText = 'Hide Info';
    } else {
      info.style.display = 'none';
      toggleButton.innerText = 'Show Info';
    }
  }

  connectedCallback() {
    this.shadowRoot
      .querySelector('#toggle-info')
      .addEventListener('click', () => this.toggleInfo());
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector('#toggle-info').removeEventListener();
  }
}

window.customElements.define('catalog-product', catalogProduct);