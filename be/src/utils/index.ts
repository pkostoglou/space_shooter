const extractCookies = (cookiesAsString: string) => {
    const cookies:{
        [key: string] : string
    } = {}
    const splittedCookies = cookiesAsString.split("; ")
    splittedCookies.forEach((cookieAsString:string) => {
        const splittedCookie = cookieAsString.split("=")
        if(splittedCookie.length!=2) return {}
        const key = splittedCookie[0] 
        const value = splittedCookie[1] 
        if(!key || !value) return {}
        cookies[key] = value
    })

    return cookies
}

export {
    extractCookies
}