require('dotenv').config({ path: '.env.local' })
console.log('GEMK length:', process.env.GEMK?.length)
console.log('GEMK preview:', process.env.GEMK?.slice(0, 6))
