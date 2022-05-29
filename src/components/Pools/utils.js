export const defaultOptions = {
  1: {
    value: "Option 1",
    id: 1,
    index: 0,
  },
  2: {
    value: "Option 2",
    id: 2,
    index: 1,
  },
  3: {
    value: "Option 3",
    id: 3,
    index: 2,
  },
};

export const defaultPool = {
  id: null,
  creator: null,
  title: "",
  options: defaultOptions,
  votes: {
    options: {},
    users: {},
  },
};

function arrayToObject(arr) {
  const res = {};
  for (let i = 0; i < arr.length; i++) {
    const key = arr[i].id;
    res[key] = arr[i];
  }
  return res;
}

function getOptions({ options, votes }) {
  const allVotesCount = Object.values(votes.users).length;
  const arrayOfOptionsWithResults = Object.keys(options)
    .map((optionId) => {
      return {
        ...options[optionId],
        result:
          Math.floor((votes.options[optionId]?.length / allVotesCount) * 100) ||
          0,
      };
    })
    .sort((a, b) => a.index - b.index);

  return arrayToObject(arrayOfOptionsWithResults);
}

export function mapPool(sourcePool) {
  const pool = {
    ...defaultPool,
    ...sourcePool,
  };

  return {
    ...pool,
    options: getOptions(pool),
  };
}
