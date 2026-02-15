const baseUrl = import.meta.env.VITE_BASE_URL

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
            credentials: 'include',
            body: JSON.stringify({ score, name })
        }
        )
        if (!response.ok) throw new Error("Err")
        const resp = await response.json()
        return resp.rank
    } catch (e) {
        console.log(e)
    }
}

const createSingleGame = async () => {
    try {
        await fetch(`${baseUrl}/game/single`, {
            method: "POST",
            credentials: 'include',
        })
    } catch (e) {
        console.log(e)
    }
}

const createDoubleGame = async () => {
    try {
        await fetch(`${baseUrl}/game/double`, {
            method: "POST",
            credentials: 'include',
        })
    } catch (e) {
        console.log(e)
    }
}

const joinGame = async (gameID: string) => {
    try {
        await fetch(`${baseUrl}/game/join`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({gameID })
        })
    } catch (e) {
        console.log(e)
    }
}

const getAvailableGames = async (): Promise<string[]> => {
    try {
        const response = await fetch(`${baseUrl}/game/double`, {
            method: "GET",
        })
        const games = await response.json()
        return games.availableGames as string[]
    } catch (e) {
        console.log(e)
        return []
    }
}

export {
    getScores,
    addScore,
    createSingleGame,
    createDoubleGame,
    joinGame,
    getAvailableGames
}