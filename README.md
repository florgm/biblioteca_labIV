# Biblioteca - Laboratorio IV - Universidad Blas Pascal

## Descripción

Proyecto realizado para la materia Laboratorio IV de la Universidad Blas Pascal. 

Vueblioteca es una aplicación para solicitar préstamos en una biblioteca que cuenta con dos microservicios que corren en contenedores docker. La biblioteca cuenta con dos tipos de usuarios, bibliotecario y socio. 

Dependiendo del tipo de usuario autenticado, son las acciones que el usuario puede realizar.
El socio puede consultar los libros disponibles, solicitar préstamos, realizar devoluciones de los libros solicitados y consultar los libros prestados. 
El bibliotecario puede consultar los libros disponibles, los libros prestados, agregar/borrar libros y modificar la cantidad de ejemplares disponibles de un libro específico.

El primer microservicio es una REST API que permite administrar la biblioteca, realizada en Node.js.
El segundo microservicio es una aplicación web realizada en Vue.js que debe permitir a los distintos tipos de usuarios autenticarse y hacer uso de la biblioteca, para ello la aplicación va a usar la aplicación REST API de biblioteca.

## Endpoints

### POST - login()
> localhost:5555/login

##### *Request body*
    {
        username: <username>,
        password: <password>
    }

##### *Response*
    200
    Body:
    {
        username; <username>,
        name: <name>,
        userID: <userID>,
        role: <role>
    }

#### Si el usuario y/o contraseña no es correcto:
##### *Response*
    404
    Body: {"Usuario y/o contraseña incorrectos"}

### POST - logout()
> localhost:5555/logout

##### *Response*
    200
    Body: {"Sesión cerrada correctamente"}

#### Si ocurrió un error de servidor:
##### *Response*
    500
    Body: {"Hubo un error al cerrar la sesión"}

#### Si no había una sesión iniciada:
##### *Response*
    400
    Body: {"No hay una sesión iniciada"}

### POST - signup()
> localhost:5555/signup

##### *Request body*
    {
        name: <name>,
        user: <user>,
        password: <password>
    }

##### *Response*
    201
    Body: {<userID>}

#### Si el usuario ingresado ya existe:
##### *Response*
    400
    Body: {"El nombre de usuario ingresado ya existe o hay un error en los parámetros ingresados"}

### GET - getBooks()
> localhost:5555/books

##### *Response*
    200
    Body: {
        {
            bookID: <bookID>,
            title: <title>,
            author: <author>,
            quantity: <quantity>,
            availables: <availables>
        },
        ...
    }

#### Si no hay libros cargados:
##### *Response*
    204

#### Si no se está logueado:
##### *Response*
    401
    Body: {"Debes estar logueado para listar los libros"}

### GET - getBook()
> localhost:5555/books/{bookID}

##### *Response*
    200
    Body: {
        {
            bookID: <bookID>,
            title: <title>,
            author: <author>,
            quantity: <quantity>
        }
    }

#### Si el libro no existe:
##### *Response*
    404
    Body: {"Libro no encontrado"}

#### Si no se está logueado:
##### *Response*
    401
    Body: {"Debes estar logueado para listar los libros"}

### POST - postBook()
> localhost:5555/books/

##### *Request body*
	{
		title: <title>,
		author: <author>,
        quantity: <quantity>
	}

##### *Response*
	201 Created
	Body: {“idLibro”:<id_Libro>}

#### Si no se ingresa algún parámetro o la cantidad es <= 0
##### *Response*
	400
	Body: {"Los parámetros ingresados no son correctos”}

#### Si el libro ya existe:
##### *Response*
	400
	Body: {"El libro que se desea ingresar ya existe"}

#### Si no se está logueado ni se es administrador:
##### *Response*
    401
    Body: {"Debes estar logueado para ingresar un libro nuevo y ser administrador"}

### DELETE - deleteBook()
> localhost:5555/books/{bookID}

##### *Response*
	204

#### Si se ingresa el id de un libro que no existe:
##### *Response*
	404
	Body: {Libro no encontrado}	

#### Si se quiere eliminar un libro que está prestado:
##### *Response*
	400
	Body: {"El libro no puede ser eliminado porque tiene ejemplares prestados"}

#### Si ocurrió un error de servidor:
##### *Response*
    500
    Body: {"Hubo un error al eliminar el libro"}

#### Si no se está logueado ni se es administrador:
##### *Response*
    401
    Body: {"Debe estar logueado para eliminar un libro y ser administrador"}

### PUT - putBook()
> localhost:5555/books/{bookID}

##### *Request body*
	Body:
	{
		quantity: <quantity>
	}

##### *Response*
	204

#### Si se ingresa el id de un libro que no existe:
##### *Response*
	404
	Body: {Libro no encontrado}	

#### Si se quiere ingresar una cantidad que es menor a la cantidad de libros que están prestados o es <= 0:
##### *Response*
	400
	Body: {"La cantidad debe ser positiva y mayor o igual a la cantidad de ejemplares prestados"}

#### Si ocurrió un error de servidor:
##### *Response*
    500
    Body: {"Hubo un error al modificar la cantidad del libro"}

#### Si no se está logueado ni se es administrador:
##### *Response*
    401
    Body: {"Debe estar logueado para modificar la cantidad de ejemplares de un libro y ser administrador"}

### GET - getUsers()
> localhost:5555/users

##### *Response*
    200
    Body: {
        {
            userID: <userID>,
            name: <name>,
            user: <user>,
            role: <role>
        },
        ...
    }

#### Si no se está logueado ni se es administrador:
##### *Response*
    401
    Body: {Debes estar logueado para listar los socios y ser administrador}

### GET - getLoans()
> localhost:5555/loans

##### *Response*
    200
    Body: {
        {
            title: <title>,
            author: <author>,
            user: <user>,
            expiration_date: <expiration_date>
        },
        ...
    }

#### Si no hay préstamos cargados:
##### *Response*
    204

#### Si no se está logueado ni se es administrador:
##### *Response*
    401
    Body: {"Debes estar logueado para listar los préstamos y ser administrador"}

### GET - getUsersLoans()
> localhost:5555/loans/user/{userID}

##### *Response*
	200 OK
	Body: 
    {
        {
            loanID: <loanID>,
            title: <title>,
            author: <author>,
            expiration_date: <expiration_date>
        },
        ...        
    }

#### Si el usuario no tiene préstamos:
##### *Response*
	204

#### Si no se está logueado ni se es socio:
##### *Response*
    401
    Body: {"Debe estar logueado para consultar los préstamos"}

### POST - postLoans()
> localhost:5555/loans

##### *Request body*
	{
		userID: <userID>,
		bookID: <bookID>,
		days: <days>
	}

##### *Response*
	201
	Body: {“loanID”: <loanID>}

#### Si se ingresa el id de un libro que no existe:
##### *Response*
	404
	Body: {"Libro no encontrado”}

#### Si no hay ejemplares disponibles:
##### *Response*
	400
	Body: {"No hay ejemplares disponibles para préstamo”}

#### Si el socio tiene préstamos vencidos:
##### *Response*
	400
	Body: {"Socio tiene prestamos vencidos, no puede pedir libros"}

#### Si la cantidad de dias de prestamo ingresada es nula o negativa:
##### *Response*
	400
	Body: {"La cantidad de dias del préstamo de no debe ser nula ni negativa"}

#### Si no se está logueado ni se es socio:
##### *Response*
    401
    Body: {"Debe estar logueado para sacar un libro prestado"}

### DELETE - deleteLoan()
> localhost:5555/loans/{loanID}

##### *Response*
	204

#### Si se ingresa el id de un préstamo que no existe:
##### *Response*
	404
	Body: {"El id del préstamo ingresado no existe”}

#### Si no se está logueado ni se es socio:
##### *Response*
    401
    Body: {"Debes estar logueado para devolver un libro"}

#### Si ocurrió un error de servidor:
##### *Response*
    500
    Body: {"Hubo un error al eliminar el prestamo"}

### GET - getInfo()
> localhost:5555/info

##### *Response*
    200
    Body: {
        {
            copies: <copies>,
            books: <books>,
            users: <users>,
            loans: <loans>
        }
    }

#### Si no se está logueado ni se es administrador:
##### *Response*
    401
    Body: {"Debes estar logueado y ser administrador"}

