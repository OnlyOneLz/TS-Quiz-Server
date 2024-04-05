
const dateFormatter = (unformattedDate) => {
        const date = new Date(unformattedDate);
        return date.toLocaleDateString();
}
module.exports = dateFormatter