export const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const limitName = (name: string) => {
  let splitName = name?.split("") ?? null;
  if (!splitName) return name;
  let shortenedArray = [];

  for (let i = 0; i < splitName.length; i++) {
    if (i <= 12) {
      shortenedArray.push(splitName[i]);
    } else {
      break;
    }
  }

  let shortString = shortenedArray.join("");
  let emailWithElipses = shortString + "...";
  return emailWithElipses;
};

export const limitString = (str: string, limit?: number): string => {
  let arr: string[] = [];
  let temp = str.split("");

  let count: number = 0;

  for (let i = 0; i < temp.length; i++) {
    if (count >= (limit ? limit : 75)) {
      break;
    } else {
      arr.push(temp[i]);
      count++;
    }
  }

  const shortened = arr.join("");
  const results = shortened + "...";
  return results;
};
