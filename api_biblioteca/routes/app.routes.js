const handler = require('../handlers/app.handler')

module.exports = app => {
    app.post('/login', (req,res) => handler.login(req,res));
    app.post('/logout', (req,res) => handler.logout(req,res));
    app.post('/signup', (req,res) => handler.signup(req,res));

    app.get('/books', (req,res) => handler.getBooks(req,res));
    app.get('/books/:book', (req,res) => handler.getBook(req,res));
    app.post('/books', (req,res) => handler.postBook(req,res));
    app.delete('/books/:book', (req,res) => handler.deleteBook(req,res));
    app.put('/books/:book', (req,res) => handler.putBook(req,res));

    app.get('/users', (req,res) => handler.getUsers(req,res));

    app.get('/loans', (req,res) => handler.getLoans(req,res));
    app.get('/loans/user/:userID', (req,res) => handler.getUsersLoans(req,res));
    app.post('/loans', (req,res) => handler.postLoans(req,res));
    app.delete('/loans/:loan', (req,res) => handler.deleteLoan(req,res));

    app.get('/info', (req,res) => handler.getInfo(req,res));
}