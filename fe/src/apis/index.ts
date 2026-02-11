const baseUrl =  import.meta.env.VITE_BASE_URL

const getScores = async () => {
    try {
        const response = await fetch(`${baseUrl}/game`)
        if (!response.ok) throw new Error("Err")
        const scores = await response.json()
        return scores
    } catch (e) {
        console.log(e)
    }
}

const addScore = async (score: number, name: string) => {
    try {
        const response = await fetch(`${baseUrl}/game`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ score, name })
        }
        )
        if (!response.ok) throw new Error("Err")
        const message = await response.json()
        return message
    } catch (e) {
        console.log(e)
    }
}

export {
    getScores,
    addScore
}