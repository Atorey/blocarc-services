const error400 = (res, err) => res.status(400).send({ statusCode: '400', message: err.message, error: 'Bad Request' })
const error404 = (res, message) => res.status(404).send({ statusCode: '404', message: message, error: 'Not found' });
const error500 = (res, err) => res.status(500).send({ statusCode: '500', message: err.message, error: 'Internal Server Error' });
const error403 = (res, message) => res.status(403).send({ statusCode: '403', message: message, error: "Forbidden" });

module.exports = {
    error400,
    error404,
    error500,
    error403
}