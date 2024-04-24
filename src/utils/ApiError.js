class ApiError extends Error {
    constructor(
        statusCode,
        message= "Something went wrong",
        errors = [],
    ){
        // console.log(message,'message')
        super()
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors
    }
}

export default ApiError