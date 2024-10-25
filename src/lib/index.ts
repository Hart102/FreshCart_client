export const api = "http://localhost:5000/api";
export const imageUrl = (imageId: string) =>
  `https://cloud.appwrite.io/v1/storage/buckets/660f31232cf0b6c64dfc/files/${imageId}/view?project=660f30b6474fd486d62e&mode=admin`;

// export const imageUrl = (imageId: string) => `https://cloud.appwrite.io/v1/storage/buckets/67113673001306ff1576/files/${imageId}/view?project=6711357300179e69010a&project=6711357300179e69010a&mode=admin`


export const setCartCount = (value: string) =>
  localStorage.setItem("cartItems", JSON.stringify(value));

export const getCartCount = () => {
  const itemsCount = localStorage.getItem("cartItems");
  
  if (itemsCount) {
    return JSON.parse(itemsCount);
  } else {
    return null;
  }
};

export const divideAndInsertBr = (text: string) => {
  if (text.length <= 41) {
    return text;
  }
  const middleIndex = Math.floor(text.length / 2);
  const spaceIndexBefore = text.lastIndexOf(" ", middleIndex);
  const spaceIndexAfter = text.indexOf(" ", middleIndex);

  let insertIndex;
  if (spaceIndexBefore === -1 && spaceIndexAfter === -1) {
    insertIndex = middleIndex;
  } else if (spaceIndexBefore === -1) {
    insertIndex = spaceIndexAfter;
  } else if (spaceIndexAfter === -1) {
    insertIndex = spaceIndexBefore;
  } else {
    insertIndex =
      middleIndex - spaceIndexBefore <= spaceIndexAfter - middleIndex
        ? spaceIndexBefore
        : spaceIndexAfter;
  }
  const firstPart = text.substring(0, insertIndex);
  const secondPart = text.substring(insertIndex + 1);
  return `${firstPart}<br>${secondPart}`;
};

export const dateOptions: { year: "numeric"; month: "long"; day: "numeric" } = {
  year: "numeric",
  month: "long",
  day: "numeric",
};
