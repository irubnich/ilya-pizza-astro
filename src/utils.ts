export const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0]
};
