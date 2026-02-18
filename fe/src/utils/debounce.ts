let timeoutID:NodeJS.Timeout | null = null

export const debounce = (func:()=>any, debounceTime: number) => {
    if(timeoutID) clearTimeout(timeoutID)
    timeoutID = setTimeout(func,debounceTime)
}