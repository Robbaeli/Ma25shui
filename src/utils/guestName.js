const animals = [
  "unicorn",
  "panda",
  "otter",
  "falcon",
  "koala",
  "dolphin",
  "tiger",
  "penguin",
];

export const generateGuestName = () => {
  const animal = animals[Math.floor(Math.random() * animals.length)];
  const number = Math.floor(Math.random() * 1000);
  return `${animal}${number}`;
};
