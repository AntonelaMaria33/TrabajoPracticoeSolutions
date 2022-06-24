
window.onload = () => { // .onload espera a que la pagina este completamente cargada

    const form = document.getElementById( 'parse-json' )
    form.onsubmit = ( e ) => {
        e.preventDefault() // hace que la app no se refresque
        const parse = document.getElementById( 'parse' )
        const parseText = parse.value

        fakeParseJSON( parseText )
        console.log( fakeParseJSON( parseText ) )

    }
}



function fakeParseJSON( str ) {
    let i = 0; // con este i vamos a recorrer todo el string

    return parseValue();

    function parseObject() {
        if ( str[ i ] === "{" ) {
            i++;
            skipWhitespace();


            const result = {};

            let initial = true;
            // si no es, buscamos el key, despues el espacio, despues los dos puntos, despues el valor.
            while ( str[ i ] !== "}" ) {
                if ( !initial ) {
                    eatComma();
                    skipWhitespace();
                }
                const key = parseString();

                skipWhitespace();
                eatColon();
                parseArray()

                const value = parseValue();
                result[ key ] = value;
                initial = false;
            }
            // me muevo al siguiente caracter despues del '}'
            i++;

            return result;
        }
    }

    function parseArray() {
        if ( str[ i ] === "[" ) {

            parseObject()
            i++;
            skipWhitespace();

            const result = [];
            let initial = true;
            while ( str[ i ] !== "]" ) {
                if ( !initial ) {
                    eatComma();
                }
                const value = parseValue();
                result.push( value );
                initial = false;
            }
            // me muevo nuevamente pero al caracter despues ']'
            i++;
            return result;
        }
    }

    function parseValue() {
        skipWhitespace();
        const value =
            parseString() ??
            parseNumber() ??
            parseObject() ??
            parseArray() ??
            parseKeyword( "true", true ) ??
            parseKeyword( "false", false ) ??
            parseKeyword( "null", null );
        skipWhitespace();
        return value;
    }

    function parseKeyword( name, value ) {
        if ( str.toString().slice( i, i + name.length ) === name ) {
            i += name.length;
            return value;
        }
    }

    function skipWhitespace() {
        while ( str[ i ] === " " ) {
            i++;
        }
    }

    function parseString() {
        if ( str[ i ] === '"' ) {
            i++;
            let result = "";
            while ( str[ i ] !== '"' ) {
                {
                    result += str[ i ];
                }
                i++;
            }
            i++;
            return result;
        }
    }

    function parseNumber() {
        let start = i;
        if ( str[ i ] === "-" ) {
            i++;
        }
        if ( str[ i ] === "0" ) {
            i++;
        } else if ( str[ i ] >= "1" && str[ i ] <= "9" ) {
            i++;
            while ( str[ i ] >= "0" && str[ i ] <= "9" ) {
                i++;
            }
        }

        if ( str[ i ] === "." ) {
            i++;
            while ( str[ i ] >= "0" && str[ i ] <= "9" ) {
                i++;
            }
        }
        if ( str[ i ] === "e" || str[ i ] === "E" ) {
            i++;
            if ( str[ i ] === "-" || str[ i ] === "+" ) {
                i++;
            }
            while ( str[ i ] >= "0" && str[ i ] <= "9" ) {
                i++;
            }
        }
        if ( i > start ) {
            return Number( str.slice( start, i ) );
        }
    }

    function eatComma() {
        if ( str[ i ] !== "," ) {
            throw new Error( 'Expected ",".' );
        }
        i++;
    }

    function eatColon() {
        if ( str[ i ] !== ":" ) {
            throw new Error( 'Expected ":".' );
        }
        i++;
    }
}


// const esunstring = {
//     "first_prop": "Una cadena de texto",
//     "second_prop": 125.30,
//     "third_prop": [
//         {
//             "sub_prop_1": "Descripción - 1",
//             "sub_prop_2": 200
//         },
//         {
//             "sub_prop_1": "Descripción - 2",
//             "sub_prop_2": 100
//         }
//     ],
//     "forth_prop": true,
//     "fifth_prop": null
// }

const img = '{    "first_prop" : "Una cadena de texto",   "second_prop" : 125.30, "third_prop" : [{"sub_prop_1": "Descripción - 1", "sub_prop_2": 200},{"sub_prop_1": "Descripción - 2", "sub_prop_2": 100}], "forth_prop": true , "fifth_prop": null }'

// console.log( fakeParseJSON( img ) )

// {    "first_prop" : "Una cadena de texto"}
// {    "first_prop" : "Una cadena de texto",   "second_prop" : 125.30}
// {    "first_prop" : "Una cadena de texto",   "second_prop" : 125.30, "third_prop" : [{"sub_prop_1": "Descripción - 1", "sub_prop_2": 200},{"sub_prop_1": "Descripción - 2", "sub_prop_2": 100}], "forth_prop": true , "fifth_prop": null }