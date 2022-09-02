import {
    get
} from 'node:http'
import {
    Transform,
    Writable
} from 'node:stream'
import {
    createWriteStream
} from 'node:fs'

const url = "http://localhost:3000"

const getHttpStream = () => new Promise(resolve => get(url, response => resolve(response)))

const stream = await getHttpStream()

stream
    .pipe(
        // it could've been a .map function
        Transform({

            // this will force the stream to use strings instead of buffers
            objectMode: true,
            transform(chunk, enc, cb) {
                // console.log('chunk', chunk)
                const item = JSON.parse(chunk)
                console.log('chunk', JSON.parse(chunk))
                // const myNumber = /\d+/.exec(item.name)[0]
                // const isEven = myNumber % 2 === 0
                // item.name = item.name.concat(isEven ? ' is even' : ' is odd')

                cb(null, JSON.stringify(item))
            }
        })
    )
    //Filter 
    .filter(chunk => chunk.includes('even'))
    // Map
    .map(chunk => chunk.toUpperCase() + "\n")
    //Pipe
    .pipe(
        // flag A => append data if existent
        createWriteStream('response.log', { flags: 'a' })
    )
    .pipe(
        Writable({
            objectMode: true,
            write(chunk, enc, cb) {
                console.log('chunk', chunk)
                return cb()
            }
        })
    )