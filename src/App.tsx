import type { FormState, ScaleResponse } from './types'
import { useState, type ChangeEvent } from "react"
import LoadingTheatre from "./components/LoadingTheatre.tsx"

const RESTRICTION_OPTIONS = [
    'Vegetar', 'Vegansk', 'Laktosefri', 'Glutenfri', 'Ingen nøtter', 'Ingen alkohol',
]

function App() {
    const [formData, setFormData] = useState<FormState>({
        recipe: '',
        fromServings: 4,
        toServings: 6,
        restrictions: [],
        notes: ''
    })

    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<ScaleResponse | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }))
    }

    const setServings = (key: 'fromServings' | 'toServings', value: number) => {
        setFormData(prev => ({ ...prev, [key]: Math.max(1, value) }))
    }

    const toggleRestriction = (restriction: string) => {
        setFormData(prev => ({
            ...prev,
            restrictions: prev.restrictions.includes(restriction)
                ? prev.restrictions.filter(r => r !== restriction)
                : [...prev.restrictions, restriction]
        }))
    }

    const handleSubmit = async () => {
        setLoading(true)
        setError(null)
        setResult(null)
        try {
            const res = await fetch('/api/scale', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            if (!res.ok) throw new Error("server error :L")
            const data: ScaleResponse = await res.json()
            setResult(data)
        } catch (err) {
            setError("Whoops, noe gikk galt. Try again, chef.")
        } finally {
            setLoading(false)
        }
    }

    const reset = () => {
        setResult(null)
        setError(null)
    }

    return (
        <div className="min-h-screen relative">
            {/* MARQUEE TICKER — judge-table flair */}
            <div className="border-b-[3px] border-[color:var(--ink)] bg-[color:var(--ink)] text-[color:var(--cream)] overflow-hidden py-2">
                <div className="ticker-track flex whitespace-nowrap font-display text-xs sm:text-sm tracking-[0.3em] uppercase">
                    {Array.from({ length: 2 }).map((_, k) => (
                        <div key={k} className="flex items-center shrink-0">
                            {[
                                "Tonight's Service",
                                "Scale with reverence",
                                "From four to forty",
                                "The judges are watching",
                                "Mise en place",
                                "Plate it up",
                            ].map((txt, i) => (
                                <span key={i} className="px-6 inline-flex items-center gap-6">
                  {txt}
                                    <span className="text-[color:var(--cherry-glow)]">✦</span>
                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-14">

                {/* HERO */}
                <header className="relative mb-12 sm:mb-16">
                    <div className="absolute -top-2 -left-2 sm:-left-4 spark" />
                    <div className="absolute top-10 right-2 spark" style={{ animationDelay: '0.8s' }} />

                    <div className="flex flex-wrap items-center gap-3 mb-5">
                        <span className="stamp cherry">★ Episode 01</span>
                        <span className="stamp">Recipe Scaler</span>
                        <span className="stamp lime" style={{ transform: 'rotate(2deg)' }}>AI Sous-Chef</span>
                    </div>

                    <h1 className="hero-title">
                        Scale your<br />
                        <span className="accent">recipe</span>{' '}
                        <em className="font-serif italic font-normal text-[color:var(--ink-soft)]" style={{ fontSize: '0.5em' }}>
                            with reverence.
                        </em>
                    </h1>

                    <p className="hero-sub mt-6 max-w-xl">
                        Paste any recipe. Tell the kitchen how many you’re feeding. Our AI
                        sous-chef (Gemini) rebalances the ingredients, the timing, and the heat
                        so dinner for forty tastes like dinner for four.
                    </p>

                    {/* decorative halftone wedge */}
                    <div
                        className="halftone halftone-fade absolute -right-6 -top-2 w-40 h-40 opacity-30 pointer-events-none hidden sm:block"
                        aria-hidden="true"
                    />
                </header>

                {/* FORM PANEL */}
                <section className="panel p-6 sm:p-8 mb-10 relative">
                    <div className="absolute -top-4 left-6 stamp">Mise en Place</div>

                    {/* Recipe textarea */}
                    <div className="mt-3 mb-7">
                        <label className="field-label" htmlFor="recipe">
                            <span className="text-[color:var(--cherry)]">①</span>&nbsp;&nbsp;Paste the recipe
                        </label>
                        <p className="field-sub">Norwegian, English, scribbled on a napkin anything goes.</p>
                        <textarea
                            id="recipe"
                            name="recipe"
                            value={formData.recipe}
                            onChange={handleChange}
                            className="textarea h-44"
                            placeholder="200g smør, 3 egg, 1 ts vaniljesukker..."
                        />
                    </div>

                    {/* Servings */}
                    <div className="mb-7">
                        <label className="field-label">
                            <span className="text-[color:var(--cherry)]">②</span>&nbsp;&nbsp;Adjust the portions
                        </label>
                        <p className="field-sub">From the original yield, to the table you’re feeding.</p>

                        <div className="flex flex-wrap items-end gap-6">
                            <div>
                                <div className="font-sans text-xs uppercase tracking-[0.18em] text-[color:var(--ink-soft)] mb-1.5">
                                    Original
                                </div>
                                <div className="stepper">
                                    <button type="button" className="stepper-btn" onClick={() => setServings('fromServings', formData.fromServings - 1)} aria-label="decrease">−</button>
                                    <div className="stepper-num">{formData.fromServings}</div>
                                    <button type="button" className="stepper-btn" onClick={() => setServings('fromServings', formData.fromServings + 1)} aria-label="increase">+</button>
                                </div>
                            </div>

                            <div className="font-display text-3xl text-[color:var(--ink-soft)] mb-1 hidden sm:block" aria-hidden>→</div>

                            <div>
                                <div className="font-sans text-xs uppercase tracking-[0.18em] text-[color:var(--ink-soft)] mb-1.5">
                                    Scaled to
                                </div>
                                <div className="stepper" style={{ borderColor: 'var(--cherry)', boxShadow: '3px 3px 0 var(--cherry)' }}>
                                    <button type="button" className="stepper-btn" onClick={() => setServings('toServings', formData.toServings - 1)} aria-label="decrease">−</button>
                                    <div className="stepper-num" style={{ color: 'var(--cherry)' }}>{formData.toServings}</div>
                                    <button type="button" className="stepper-btn" onClick={() => setServings('toServings', formData.toServings + 1)} aria-label="increase">+</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Restrictions */}
                    <div className="mb-7">
                        <label className="field-label">
                            <span className="text-[color:var(--cherry)]">③</span>&nbsp;&nbsp;Dietary considerations
                        </label>
                        <p className="field-sub">Tap the ones that apply. The chef will adapt.</p>
                        <div className="flex flex-wrap gap-2.5">
                            {RESTRICTION_OPTIONS.map(option => {
                                const active = formData.restrictions.includes(option)
                                return (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => toggleRestriction(option)}
                                        className={`chip ${active ? 'is-active' : ''}`}
                                        aria-pressed={active}
                                    >
                                        {option}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="mb-8">
                        <label className="field-label" htmlFor="notes">
                            <span className="text-[color:var(--cherry)]">④</span>&nbsp;&nbsp;Chef’s notes <span className="text-[color:var(--ink-soft)] font-serif italic normal-case tracking-normal text-[0.85rem] ml-1">(optional)</span>
                        </label>
                        <p className="field-sub">Substitutions, omissions, swaps. Anything you want the chef to know.</p>
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className="textarea h-24"
                            placeholder="Har ikke kjernemelk, vil droppe vinen..."
                        />
                    </div>

                    {/* CTA */}
                    <div className="flex flex-wrap items-center gap-4">
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !formData.recipe.trim()}
                            className="cta"
                        >
                            {loading ? 'On the pass…' : 'Plate it up'}
                            <span className="cta-arrow">→</span>
                        </button>
                        <span className="font-serif italic text-[color:var(--ink-soft)]">
              Scaled in seconds, by an AI that takes food seriously.
            </span>
                    </div>
                </section>

                {/* ERROR */}
                {error && (
                    <div className="alert alert-error reveal-up mb-8">
                        <div className="alert-title">Service interrupted</div>
                        <div>{error}</div>
                    </div>
                )}

                {/* LOADING */}
                {loading && <LoadingTheatre />}

                {/* RESULT */}
                {result && !loading && (
                    <section className="space-y-8 mt-2">
                        {/* result hero */}
                        <div className="reveal-up delay-0 panel p-6 sm:p-7 relative overflow-hidden">
                            <div
                                className="halftone halftone-cherry halftone-fade absolute -top-4 -right-4 w-48 h-48 opacity-50 pointer-events-none"
                                aria-hidden="true"
                            />
                            <div className="stamp cream mb-3" style={{ transform: 'rotate(-3deg)' }}>★ Service ★</div>
                            <h2 className="font-display text-3xl sm:text-5xl leading-none">
                                Scaled to <span className="text-[color:var(--cherry)]">{result.scaledServings}</span>{' '}
                                <span className="font-serif italic text-[color:var(--ink-soft)] text-2xl sm:text-3xl">portions</span>
                            </h2>
                            <div className="mt-3 font-serif italic text-[color:var(--ink-soft)]">
                                Rebalanced from the original {formData.fromServings}. Mise en place below.
                            </div>

                            <button
                                onClick={reset}
                                className="absolute top-5 right-5 chip"
                                style={{ background: 'var(--cream-warm)' }}
                            >
                                ↺ New dish
                            </button>
                        </div>

                        {/* INGREDIENTS */}
                        <div className="reveal-up delay-1 panel p-6 sm:p-7">
                            <div className="section-tab">
                                <span className="num">01</span> Ingredients
                            </div>
                            <div className="font-serif italic text-[color:var(--ink-soft)] mb-3">
                                Quantities adjusted for {result.scaledServings} portions.
                            </div>
                            <div>
                                {result.ingredients.map((ing, i) => (
                                    <div className="ing-row" key={i}>
                                        <div className="ing-amt">{ing.amount}</div>
                                        <div className="ing-name">
                                            {ing.name}
                                            {ing.note && <span className="note">— {ing.note}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* STEPS */}
                        <div className="reveal-up delay-2 panel p-6 sm:p-7">
                            <div className="section-tab" style={{ background: 'var(--cherry)', color: 'var(--cream)' }}>
                                <span className="num" style={{ color: 'var(--lime-glow)' }}>02</span> Method
                            </div>
                            <div className="font-serif italic text-[color:var(--ink-soft)] mb-3">
                                Step by step, with timing recalibrated where needed.
                            </div>
                            <div>
                                {result.steps.map((step, i) => (
                                    <div className="step-row" key={i}>
                                        <div className="step-num">{String(i + 1).padStart(2, '0')}</div>
                                        <div className="step-body">{step}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* NOTES */}
                        {result.notes.length > 0 && (
                            <div className="reveal-up delay-3 alert alert-info">
                                <div className="alert-title">★ Chef’s notes</div>
                                <ul className="space-y-2 mt-1 font-serif">
                                    {result.notes.map((note, i) => (
                                        <li key={i} className="flex gap-3">
                                            <span className="text-[color:var(--lime-deep)] font-display">✦</span>
                                            <span>{note}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* WARNINGS */}
                        {result.warnings && result.warnings.length > 0 && (
                            <div className="reveal-up delay-4 alert alert-warn">
                                <div className="alert-title">⚠ Watch the heat</div>
                                <ul className="space-y-2 mt-1 font-serif">
                                    {result.warnings.map((w, i) => (
                                        <li key={i} className="flex gap-3">
                                            <span className="text-[color:var(--cherry-deep)] font-display">!</span>
                                            <span>{w}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </section>
                )}

                {/* FOOTER */}
                <footer className="mt-20 pt-8 border-t-[2px] border-dashed border-[color:var(--paper-edge)] text-center">
                    <div className="font-display text-sm tracking-[0.3em] uppercase text-[color:var(--ink-soft)]">
                        ✺ Bon appétit · Oslo · MMXXVI ✺
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default App
