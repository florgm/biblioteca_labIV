const validator = require('../libs/validators_func');
const query = require('../libs/db_queries');
const aux = require('../libs/aux_funcs');
const bcrypt = require('bcrypt');

const DIA_EN_MILISEGUNDOS = 1000 * 60 * 60 * 24;

module.exports = {
    //// L O G I N  &  R E G I S T E R ////
    login: async (req,res) => {
        var username = req.body.username;
        var password = req.body.password;
        
        var exists = await query.checkLogin(username, password);
        
        if(exists != -1) {
            req.session.loggedin = true;
            req.session.username = username;
            req.session.userID = exists[0].userID;
            req.session.role = exists[0].role;
            req.session.name = exists[0].name;
            res.status(200).json({
                username: req.session.username,
                name: req.session.name,
                userID: req.session.userID,
                role: req.session.role
            });
        } else {
            res.status(404).json("Usuario y/o contraseña incorrectos");
        }
    },

    logout: (req,res) => {
        if(req.session.loggedin) {
            req.session.destroy(err => {
                if (err) {
                    return res.status(500).json("Hubo un error al cerrar la sesión");
                }
                else {
                    res.status(200).json("Sesión cerrada correctamente");
                }
            });
        } else {
            res.status(400).json("No hay una sesión iniciada");
        }
    },

    signup: async (req,res) => {
        var name = req.body.name;
        var user = req.body.user;
        var password = bcrypt.hashSync(req.body.password, 8);

        var existingUser = await query.existsUser(user);
        
        if(validator.validateSignup(name,user,password) && existingUser == -1) {
            var userID = aux.getNewId();
            query.postUser(userID, name, user, password);
            res.status(201).json(userID);
        } else {
            res.status(400).json("El nombre de usuario ingresado ya existe o hay un error en los parámetros ingresados");    
        }
    },
    
    //// B O O K S ////
    getBooks: async (req,res) => {
        if (!req.session.loggedin) {
            res.status(401).json("Debes estar logueado para listar los libros");
        } else {
            var result = await query.getBooks();
            
            if(result == -1) {
                res.status(204).send();
            } else {
                res.status(200).json(result);
            }
        }
    },

    getBook: async (req,res) => {
        if (!req.session.loggedin) {
            res.status(401).json("Debes estar logueado para ver la información de un libro");
        } else {
            var bookID = req.params.book
            var findBook = await query.findBookIndex(bookID);

            if(findBook == -1) {
                res.status(404).json("Libro no encontrado");
            } else {
                res.status(200).json(findBook);
            }
        }
    },

    postBook: async (req,res) => {
        if (req.session.loggedin && req.session.role == 'L') {
            var title = req.body.title;
            var author = req.body.author;
            var quantity = req.body.quantity;

            if(validator.validateBook(title,author,quantity)) {
                
                var existingBook = await query.existsBook(title,author);
                
                if(existingBook == -1) { 
                    var bookID = aux.getNewId();

                    query.postBook(bookID,title,author,quantity);
                    res.status(201).json("idLibro: " + bookID);

                } else {
                    res.status(400).json("El libro que se desea ingresar ya existe");
                }
            } else {
                res.status(400).json("Los parámetros ingresados no son correctos");
            }
        } else {
            res.status(401).json("Debes estar logueado para ingresar un libro nuevo y ser administrador"); 
        }
    },

    deleteBook: async (req,res) => {
        if (req.session.loggedin && req.session.role == 'L') {
            var bookdID = req.params.book;
            var deleteBook = await query.findBookIndex(bookdID);
        
            if(deleteBook == -1) {
                res.status(404).json("Libro no encontrado");
            } else {
                var borrowedBook = await query.borrowedBooks(bookdID);
    
                if(borrowedBook == 0) {
                    var result = await query.deleteBook(bookdID);
    
                    if(result <= 0) {
                        res.status(500).json("Hubo un error al eliminar el libro");
                    } else {
                        res.status(204).send();
                    }
    
                } else {
                    res.status(400).json("El libro no puede ser eliminado porque tiene ejemplares prestados");
                }
            }
        } else {
            res.status(401).json("Debe estar logueado para eliminar un libro y ser administrador");
        }
    },

    putBook: async (req,res) => {
        if (req.session.loggedin && req.session.role == 'L') {
            var bookID = req.params.book;
            var modifyBook = await query.findBookIndex(bookID);
    
            if(modifyBook == -1) {
                res.status(404).json("Libro no encontrado");
            } else {
                var newQuantity = req.body.quantity;
                var borrowedQuantity = await query.borrowedBooks(bookID);
            
                if(validator.validateBookModification(borrowedQuantity,newQuantity)) {
                    result = await query.putBook(newQuantity,bookID);
    
                    if(result <= 0) {
                        res.status(500).json("Hubo un error al modificar la cantidad del libro");
                    } else {
                        res.status(204).send();
                    }
                } else {
                    res.status(400).json("La cantidad debe ser positiva y mayor o igual a la cantidad de ejemplares prestados");    
                }
            }
        } else {
            res.status(401).json("Debe estar logueado para modificar la cantidad de ejemplares de un libro y ser administrador");
        }
    },

    //// U S E R S ////
    getUsers: async (req,res) => {
        if (req.session.loggedin && req.session.role == 'L') {
            var result = await query.getUser();
            res.status(200).json(result);
        } else {
            res.status(401).json("Debes estar logueado para listar los socios y ser administrador");
        }
    },

    //// L O A N S ////
    getLoans: async (req,res) => {
        if (!req.session.loggedin && req.session.role != 'L') {
            res.status(401).json("Debes estar logueado para listar todos los préstamos y ser administrador");
        } else {
            var result = await query.getLoans();

            if(result == -1) {
                res.status(204).send();
            } else {
                res.status(200).json(result);
            }
        }
    },

    getUsersLoans: async (req,res) => {
        if (req.session.loggedin && req.session.role == 'U') {
            var result = await query.getUsersLoans(req.session.userID);

            if(result <= 0) {
                res.status(204).send();
            } else {
                res.status(200).json(result);
            }        
        } else {
            res.status(401).json("Debe estar logueado para consultar los préstamos");
        }
    },

    postLoans: async (req,res) => {
        if (req.session.loggedin && req.session.role == 'U') {
            var userLoanID = req.session.userID;
            var bookLoanID = await query.findBookIndex(req.body.bookID);
            
            if (bookLoanID != -1) {
                var expiredBooks = await query.checkExpiredBooks(userLoanID);
    
                if(expiredBooks) {
                    var borrowedBooks = await query.borrowedBooks(req.body.bookID);
                    var bookCopies = await query.bookCopies(req.body.bookID);
                    
                    if(bookCopies - borrowedBooks > 0) {
                        var loanID = aux.getNewId();
                        var loanDays = req.body.days;
    
                        if(validator.validateLoan(loanDays)) {
                            var expirationDate = Date.now() + loanDays * DIA_EN_MILISEGUNDOS;
                            query.postLoan(loanID, userLoanID, req.body.bookID, expirationDate);
                            res.status(201).json("idPrestamo: "+ loanID);
                        } else {
                            res.status(400).json("La cantidad de dias del préstamo no debe ser nula ni negativa");   
                        }
                    } else {
                        res.status(400).json("No hay ejemplares disponibles para préstamo");
                    }
                } else {
                    res.status(400).json("Tiene préstamos vencidos, no puede pedir nuevos libros");
                }
            } else {
                res.status(404).json("Libro no encontrado");
            }
        } else {
            res.status(401).json("Debe estar logueado para sacar un libro prestado");
        }
    },

    deleteLoan: async (req,res) => {
        if (req.session.loggedin && req.session.role == 'U') {
            var deleteLoanID = await query.findLoanIndex(req.params.loan);
            
            if(deleteLoanID != -1) {
                var result = await query.deleteLoan(req.params.loan);

                if(result <= 0) {
                    res.status(500).json("Hubo un error al eliminar el prestamo");
                } else {
                    res.status(204).send();
                }
            }
            else {
                res.status(404).json("El id del prestamo ingresado no existe");
            }
        } else {
            res.status(401).json("Debes estar logueado para devolver un libro");
        }
    },

    //// S T A T I S T I C S ////
    getInfo: async (req, res) => {
        if (req.session.loggedin && req.session.role == 'L') {
            var totalCopies = await query.getTotalBooksCopies();
            var totalBooks = await query.getTotalBooks();
            var totalUsers = await query.getTotalUsers();
            var totalLoans = await query.getTotalLoans();

            if(totalCopies != 0) {
                totalCopies = totalCopies.reduce((b, {quantity}) => b + quantity, 0);   
            }

            res.status(200).json({
                copies: totalCopies,
                books: totalBooks,
                users: totalUsers,
                loans: totalLoans
            });
        } else {
            res.status(401).json("Debes estar logueado y ser administrador");
        }
    }
}