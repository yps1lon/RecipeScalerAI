
export type FormState = {
    recipe: string         // textarea (was: meal)
    fromServings: number   // number input (was: priceMin)
    toServings: number     // number input (was: priceMax)
    restrictions: string[] // pills (was: wineType)
    notes: string          // textarea — "I don't have buttermilk", "skip the wine"
}

export type ScaleResponse = {
    scaledServings: number
    ingredients: {
        name: string
        amount: string      // "250 g", "1.5 ts", "en klype"
        note?: string       // "scaled down — see notes below"
    }[]
    steps: string[]       // instructions, lightly adjusted for new quantities
    notes: string[]       // smart substitutions, scaling caveats, dietary swaps
    warnings?: string[]   // "halving baking soda is risky — consider..."
}
