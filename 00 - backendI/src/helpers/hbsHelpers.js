const hbsHelpers = {
  capitalizeTitle: (text) => {
    if (text === "pid") return text.toUpperCase();
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },

  completeNullable: (text) => {
    if (text === "" || text === undefined || text === null) return "-";
    return text;
  },
};

export default hbsHelpers;
