import icons from "./icons";
const { AiFillStar, AiOutlineStar } = icons;
// chuyển tên tiếng việt thành slug không dấu
export const createSlug = (string) =>
  string
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(" ")
    .join("-");

export const formatMoney = (number) =>
  Number(number.toFixed(1)).toLocaleString();

export const renderStarFromNumber = (number, size) => {
  if (!Number(number)) return;
  // 4 => [1,1,1,1,0]
  number = Math.round(number);
  const stars = [];
  for (let i = 0; i < +number; i++) {
    stars.push(<AiFillStar key={i} color="orange" size={size || 16} />);
  }
  for (let i = 5; i > +number; i--) {
    stars.push(<AiOutlineStar key={i} color="orange" size={size || 16} />);
  }
  return stars;
};
