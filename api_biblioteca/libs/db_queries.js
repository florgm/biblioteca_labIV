const util = require('util');
const con = require('./db_connection')
const bcrypt = require('bcrypt');
const query = util.promisify(con.query).bind(con);

module.exports = {
    //// L O G I N  &  R E G I S T E R ////
    checkLogin: async (username, password) => {
        const queryStr = `SELECT * FROM db_library.users WHERE user = ?`;
        const queryResult = await query(queryStr, [username]);
        
        if(queryResult.length <= 0) {
            return -1;
        }
        
        let passwordIsValid = bcrypt.compareSync(password, queryResult[0].pass)

        if(!passwordIsValid) {
            return -1;
        }

        return queryResult;
    },

    //// B O O K S ////
    getBooks: async () => {
        const queryResult = await query(`SELECT b.bookID, b.title, b.author, b.quantity, b.quantity - count(l.bookID) as availables
                                           FROM db_library.books b
                                           LEFT JOIN db_library.loans l
                                                  ON b.bookID = l.bookID
                                        GROUP BY b.bookID, b.title, b.quantity
                                        ORDER BY b.title`);
        if (queryResult.length <= 0) {
            return -1;
        }
        return queryResult;
    },

    existsBook: async (title, author) => {
        const queryStr = `SELECT * FROM db_library.books WHERE title = ? AND author = ?`;
        const queryResult = await query(queryStr, [title,author]);
        
        if (queryResult.length <= 0) {
            return -1;
        } 
        return queryResult;
    },

    postBook: async (bookID, title, author, quantity) => {
        const queryStr = `INSERT INTO db_library.books (bookID, title, author, quantity) VALUES (?, ?, ?, ?)`;
        const queryResult = await query(queryStr, [bookID,title,author,quantity]);
        return queryResult;
    },

    deleteBook: async (bookID) => {
        const queryStr = `DELETE FROM db_library.books WHERE bookID = ?`;
        const queryResult = await query(queryStr, [bookID]);
        return queryResult;
    },

    putBook: async (newQuantity,bookID) => {
        const queryStr = `UPDATE db_library.books SET quantity = ? WHERE bookID = ?`;
        const queryResult = await query(queryStr, [newQuantity,bookID]);
        return queryResult
    },

    findBookIndex: async (bookID) => {
        const queryStr = `SELECT * FROM db_library.books WHERE bookID = ?`;
        const queryResult = await query(queryStr, [bookID]);
    
        if(queryResult.length <= 0) {
            return -1;
        }
        return queryResult;
    },

    borrowedBooks: async (bookID) => {
        const queryStr = `SELECT COUNT(*) AS borrowedBooks FROM db_library.loans WHERE bookID = ?`;
        const queryResult = await query(queryStr, [bookID]);
    
        if(queryResult[0].borrowedBooks == 0) {
            return 0;
        }
        return queryResult[0].borrowedBooks;
    },

    bookCopies: async (bookID) =>{
        const queryStr = `SELECT quantity FROM db_library.books WHERE bookID = ?`;
        const queryResult = await query(queryStr, [bookID]);
        
        if(queryResult.length <= 0) {
            return -1;
        }
        return queryResult[0].quantity;
    },

    //// U S E R S ////
    getUser: async () => {
        const queryResult = await query(`SELECT userID, name, user, role FROM db_library.users`);
        return queryResult;
    },

    postUser: async (userID, name, user, password) => {
        const queryStr = `INSERT INTO db_library.users (userID, name, user, pass) VALUES (?, ?, ?, ?)`;
        const queryResult = await query(queryStr, [userID,name,user,password]);
        return queryResult;
    },
    
    existsUser: async (user) => {
        const queryStr = `SELECT * FROM db_library.users WHERE user = ?`;
        const queryResult = await query(queryStr, [user]);
    
        if (queryResult.length <= 0) {
            return -1;
        }
        return queryResult;
    },

    //// L O A N S ////
    getLoans: async () => {
        const queryResult = await query(`SELECT b.title, b.author, u.user, l.expiration_date
                                           FROM db_library.books b
                                           JOIN db_library.loans l
                                             ON b.bookID = l.bookID
                                           JOIN db_library.users u
                                             ON u.userID = l.userID
                                          ORDER BY l.expiration_date`);
        if (queryResult.length <= 0) {
            return -1;
        }                                          
        return queryResult;
    },

    getUsersLoans: async (userID) => {
        const queryStr = `SELECT l.loanID, b.title, b.author, l.expiration_date
                            FROM db_library.loans l
                            JOIN db_library.books b
                              ON b.bookID = l.bookID
                           WHERE l.userID = ?
                           ORDER BY l.expiration_date`;
        const queryResult = query(queryStr, [userID]);
        return queryResult;
    },

    findLoanIndex: async (loanID) => {
        const queryStr = `SELECT * FROM db_library.loans WHERE loanID = ?`;
        const queryResult = await query(queryStr, [loanID]);
        
        if(queryResult.length <= 0) {
            return -1;
        }
        return queryResult;
    },

    checkExpiredBooks: async (userLoanID) => {
        const queryStr = `SELECT COUNT(*) AS expiredLoans FROM db_library.loans WHERE userID = ? AND expiration_date < ?`;
        const queryResult = await query(queryStr, [userLoanID, Date.now()]);

        return queryResult[0].expiredLoans == 0;
    },

    postLoan: async (loanID, userLoanID, bookLoanID, expiration_date) => {
        const queryStr = `INSERT INTO db_library.loans (loanID, userID, bookID, expiration_date) VALUES (?, ?, ?, ?)`;
        const queryResult = await query(queryStr, [loanID,userLoanID,bookLoanID,expiration_date]);
        return queryResult;
    },

    deleteLoan: async (loanID) => {
        const queryStr = `DELETE FROM db_library.loans WHERE loanID = ?`;
        const queryResult = await query(queryStr, [loanID]);
        return queryResult;
    },

    //// S T A T I S T I C S ////
    getTotalBooksCopies: async () => {
        const queryResult = await query(`SELECT quantity FROM db_library.books`);
        
        if (queryResult.length <= 0) {
            return 0;
        }
        return queryResult;
    },

    getTotalBooks: async() => {
        const queryResult = await query(`SELECT COUNT(*) AS totalBooks FROM db_library.books`);
        
        if (queryResult.length <= 0) {
            return 0;
        }
        
        return queryResult[0].totalBooks;
    },

    getTotalUsers: async() => {
        const queryResult = await query(`SELECT COUNT(*) AS totalUsers
                                           FROM db_library.users u
                                          WHERE u.role = 'U'`);
        
        if (queryResult.length <= 0) {
            return 0;
        }
        return queryResult[0].totalUsers;
    },

    getTotalLoans: async() => {
        const queryResult = await query(`SELECT COUNT(*) AS totalLoans FROM db_library.loans`);
        
        if (queryResult.length <= 0) {
            return 0;
        }
        return queryResult[0].totalLoans;
    }
}

