import { GoogleGenAI, Type } from '@google/genai'

export default async function handler(req: any, res: any) {
    console.log('=== Handler called ===')
    console.log('Method:', req.method)
    console.log('Key length:', process.env.GEMK?.length ?? 'undefined')

    try {
        if (req.method !== 'POST') {
            console.log('Wrong method')
            return res.status(405).json({ error: 'Method not allowed' })
        }

        const apiKey = process.env.GEMK
        if (!apiKey) {
            console.log('No API key found')
            return res.status(500).json({ error: 'GEMINI_API_KEY not set on server' })
        }

        // Body parsing with logging
        let body = req.body
        console.log('req.body type:', typeof body, 'value:', body)

        if (typeof body === 'string') {
            body = JSON.parse(body)
        }
        if (!body) {
            console.log('Reading raw body...')
            const chunks: Buffer[] = []
            for await (const chunk of req) chunks.push(chunk)
            const raw = Buffer.concat(chunks).toString('utf-8')
            console.log('Raw body:', raw)
            body = JSON.parse(raw)
        }

        console.log('Parsed body:', body)

        const { recipe, fromServings, toServings, restrictions, notes } = body

        if (!recipe || !fromServings || !toServings) {
            console.log('Missing fields')
            return res.status(400).json({ error: 'Missing required fields' })
        }

        const prompt = `
You are a precise cooking assistant. Scale the following recipe from ${fromServings} to ${toServings} servings.

CRITICAL: Respond entirely in the same language as the recipe below. If the recipe is in Norwegian, respond in Norwegian. If English, respond in English. This applies to ingredient names, steps, notes, AND warnings.

Recipe:
${recipe}

Dietary restrictions: ${restrictions?.length ? restrictions.join(', ') : 'none'}
User notes: ${notes || 'none'}

Rules:
- Scale ingredients proportionally, but flag items that don't scale linearly (spices, salt, leavening agents, eggs).
- Suggest substitutions for the dietary restrictions and user notes.
- Lightly adjust cooking instructions if the new quantity changes pan size or timing.
- If something is risky to scale (e.g., halving baking soda), warn the user.

REMINDER: Match the recipe's language in every single output field. Do not translate to English.
`.trim()

        console.log('Calling Gemini...')
        const ai = new GoogleGenAI({ apiKey })

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        scaledServings: { type: Type.NUMBER },
                        ingredients: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    amount: { type: Type.STRING },
                                    note: { type: Type.STRING },
                                },
                                required: ['name', 'amount'],
                            },
                        },
                        steps: { type: Type.ARRAY, items: { type: Type.STRING } },
                        notes: { type: Type.ARRAY, items: { type: Type.STRING } },
                        warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ['scaledServings', 'ingredients', 'steps', 'notes'],
                },
            },
        })

        console.log('Gemini responded')
        const parsed = JSON.parse(response.text ?? '{}')
        return res.status(200).json(parsed)
    } catch (err: any) {
        console.error('=== ERROR ===')
        console.error('Message:', err?.message)
        console.error('Stack:', err?.stack)
        return res.status(500).json({ error: err?.message ?? 'Unknown error' })
    }
}