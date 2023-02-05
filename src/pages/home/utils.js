import slugify from "slugify";
import omit from "lodash/omit";
import isEmpty from "lodash/isEmpty";

export const createProductData = (data) => {
  return {
    name: data.name,
    price: {
      currentPrice: data.price,
      discount: 0,
      mrp: null,
    },
    description: data.description || null,
    descriptionHtml: null,
    slug: slugify(data.name || "", {
      lower: true,
      trim: true,
      locale: "en",
    }),
    subcategory: omit(data.subcategory, "createdAt", "updatedAt"),
    category: omit(data.category, "createdAt", "updatedAt"),
    superSubcategory: null,
    brand: omit(data.brand, "createdAt", "updatedAt", "address", "tags"),
    thumbnail: data.images[0],
    status: true,
    delivery: data.delivery,
    tags: data.tags,
    createdBy: data.createdBy,
    listingType: data.listingType,
  };
};

export const validateProductData = (data) => {
  let message = "";
  if (!data.images || isEmpty(data.images)) {
    message = "Images are required";
    return message;
  }
  if (!data.name) {
    message = "Name is required";
    return message;
  }
  if (!data.price) {
    message = "Price is required";
    return message;
  }
  if (!data.tags || data.tags.length === 0) {
    message = "Hash Tags are required";
    return message;
  }
  if (!data.category || isEmpty(data.category)) {
    message = "Category is required";
    return message;
  }
  if (!data.subcategory || isEmpty(data.subcategory)) {
    // change later
    message = "Category is required";
    return message;
  }
  if (!data.brand) {
    message = "Brand is required";
    return message;
  }
  if (!data.createdBy) {
    message = "User is required";
    return message;
  }
  if (!data.delivery) {
    message = "Delivery is required";
    return message;
  }

  return message;
};


export const fallbackCopyClipboard = (text) => {
  const el = document.createElement("textarea");
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
};

export const copyToClipboard = (text) => {
  if (!navigator.clipboard) {
    fallbackCopyClipboard(text);
    return Promise.resolve();
  }
  return navigator.clipboard.writeText(text);
};

export const handleShare = (data, callback = () => {}) => {
  if (
    navigator.canShare &&
    data.files &&
    navigator.canShare({
      files: data.files,
    })
  ) {
    navigator.share(data).catch(() => {
      copyToClipboard(data.url).then(() => {
        callback("Link Copied to Clipboard");
      });
    });
  } else {
    copyToClipboard(data.url).then(() => callback("Link Copied to Clipboard"));
  }
};

export const getProfileShareData = ({ name, id }) => {
  const shareData = {
    title: name,
    text: "Buy from my collection on The Clock",
    url: `https://www.theclock.xyz/profile-page/${name}?id=${id}`,
  };
  return shareData;
};

export const getProductShareData = async ({ name, id, thumbnail }) => {
  let file = null;
  try {
    const blob = await fetch(thumbnail).then((r) => r.blob());
    file = new File([blob], "image.png", { type: blob.type });
  } catch (e) {
    console.log(e);
  }

  const shareData = {
    title: name,
    text: "Checkout this on The Clock",
    url: `https://www.theclock.xyz/product-page/${name}?id=${id}`,
    files: file ? [file] : null,
  };
  return shareData;
};



