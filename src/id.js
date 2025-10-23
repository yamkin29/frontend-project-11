let seed = 1
export const uid = (prefix = 'id') => `${prefix}_${Date.now()}_${seed++}`
