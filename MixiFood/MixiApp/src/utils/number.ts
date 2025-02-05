export const formatPrice = (str: string) => {
  const price = Number(str);
  const formattedNumber = price.toLocaleString('vi-VN');
  return formattedNumber;
};

export const secondToMinuteStr = (num: number) => {
  const minutes = Math.floor(num / 60);
  const remainingSeconds = num % 60;
  const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

  return `${minutes}:${formattedSeconds}`;
};
