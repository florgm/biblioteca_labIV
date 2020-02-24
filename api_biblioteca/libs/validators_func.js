module.exports = {
    validateBook: (title, author, quantity) => {
        if(typeof title == 'string' && typeof author == 'string' && typeof quantity === 'number' && quantity > 0) {
            return true;
        }
        return false;
    },

    validateBookModification: (borrowedQuantity, newQuantity) => {
        if (typeof newQuantity === 'number' && newQuantity > 0 && newQuantity >= borrowedQuantity) {
            return true;
        }
        return false;
    },

    validateSignup: (name, user, password) => {
        if (name != undefined && user != undefined && password != undefined) {
            return true;
        }
        return false;
    },

    validateLoan: (loanDays) => {
        if(typeof loanDays === 'number' && loanDays > 0) {
            return true;
        }
        return false;
    }
}