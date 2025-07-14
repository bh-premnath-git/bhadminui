
const formatTimestamp = (timestamp: string) => {
  try {
    const date = new Date(timestamp)
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return timestamp // Return original if invalid
    }
    
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    
    return `${day}/${month}/${year}`
  } catch (error) {
    return timestamp // Return original if parsing fails
  }
}

export { formatTimestamp }